# sfm
How to use that?
1. Add this script to your site 
https://cdn.jsdelivr.net/gh/softdy/sfm/index.js<pre><script src="https://cdn.jsdelivr.net/gh/softdy/sfm/index.js"></script></pre>
2. Write code like that to create as Iframe <pre><script>
    window._sfm.createIframe({
          endpoint: '', // the endpoint
          token: '',  // the endpoint
          rootElementId: 'root', //
          mode: 'management', // management|select_files
          show_header_box: true,
          show_search_box: true,
          show_file_info_box: true,
          show_sidebar_box: true,
          cdn: '',  // the cdn to load your statics
    });
</script></pre>
