window._sfm = {
    options: {
        type: 'widget', // widget|iframe
        endpoint: '',
        token: '',
        rootElementId: 'root', //
        mode: 'management', // management|select_files
        show_header_box: true,
        show_search_box: true,
        show_file_info_box: true,
        show_sidebar_box: true,
        // for premium version
        beforeLoad: function (event) {
            console.log('sfm before load')
            console.log(event)
        },
        afterLoad: function (event) {
            console.log('sfm after')
            console.log(event)
        },
        onSelect: function (files) {
            console.log('sfm on select files')
            console.log(files)
        },
        onClose: function (event) {
            console.log('sfm on close')
            console.log(event)
        },
    },
    url: null,
    init(options) {
        this.options = Object.assign(this.options, options)
        this._buildUrl()
        this._listenEvent(window)
    },
    isObject: function (obj) {
        return obj === Object(obj);
    },
    addParams: function (url, param, value) {

        let that = this;
        if (Array.isArray(value)) {
            value.map(function (e, index) {
                url = that.addParams(url, param + '[' + index + ']', e)
            })
            return url
        }
        if (this.isObject(param)) {
            for (let key in param) {
                url = this.addParams(url, key, param[key]);
            }
            return url;
        }
        param = encodeURIComponent(param);
        var r = "([&?]|&amp;)" + param + "\\b(?:=(?:[^&#]*))*";
        var a = document.createElement('a');
        var regex = new RegExp(r);
        var str = param + (value ? "=" + encodeURIComponent(value) : "");
        a.href = url;
        var q = a.search.replace(regex, "$1" + str);
        if (q === a.search) {
            a.search += (a.search ? "&" : "") + str;
        } else {
            a.search = q;
        }
        return a.href;
    },
    _listenEvent(win) {
        win.addEventListener('message', function (event) {
            if (event.data.function_name === "select_callback_function" + window._sfm.options.rootElementId) {
                return window._sfm.options.onSelect(event.data.data)
            }
            if (event.data.function_name === "close_callback_function" + window._sfm.options.rootElementId) {
                return window._sfm.options.onClose(event.data.data)
            }
            if (event.data.function_name === "before_load_callback_function" + window._sfm.options.rootElementId) {
                return window._sfm.options.beforeLoad(event.data.data)
            }
            if (event.data.function_name === "after_load_callback_function" + window._sfm.options.rootElementId) {
                return window._sfm.options.afterLoad(event.data.data)
            }
        }, false)
    },
    _isIframeType() {
        return this.options.type === 'iframe'
    },
    _isWindowType() {
        return this.options.type === 'window'
    },
    _getRootElementId() {
        return this.options.rootElementId
    },
    _buildUrl() {
        let endpoint = this.options.endpoint
        if (this._isIframeType() || this._isWindowType()) {
            endpoint = this.addParams(endpoint, {
                mode: this.options.mode,
                show_header_box: this.options.show_header_box,
                show_search_box: this.options.show_search_box,
                show_file_info_box: this.options.show_file_info_box,
                show_sidebar_box: this.options.show_sidebar_box,
            })

            if (this._isWindowType()) {
                endpoint = this.addParams(endpoint, {
                    _swf_is_window: '_swf_is_window'
                })
            }

            if (this._isIframeType()) {
                endpoint = this.addParams(endpoint, {
                    _swf_is_iframe: '_swf_is_iframe'
                })
            }

            if (this.options.rootElementId) {
                endpoint = this.addParams(endpoint, {
                    rootElementId: this.options.rootElementId
                })
            }
            if (this.options.token) {
                endpoint = this.addParams(endpoint, {
                    token: this.options.token
                })
            }
        }
        this.url = endpoint
    },
    getUrl() {
        return this.url
    },
    create(options = {}) {
        this.init(options)
        if (this._isIframeType()) {
            var iframe = '<iframe src="' + this.getUrl() + '" style="height:100%;width:100%;border: none;padding: 0;margin:0"></iframe>';
            return document.getElementById(this._getRootElementId()).innerHTML = iframe;
        }

        if (this._isWindowType()) {
            var w = window.screen.width
            var h = window.screen.height
            var iframe = '<html><head><style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style></head><body><iframe src="' + this.getUrl() + '" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe></html></body>';
            var win = window.open('', '', 'directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no, width=' + w + ', height=' + h);
            win.document.write(iframe);
            this._listenEvent(win)
        }
    },
    createIframe(options = {}) {
        options['type'] = 'iframe'
        return this.create(options)
    },
    createWindow(options = {}) {
        options['type'] = 'window'
        return this.create(options)
    },
}