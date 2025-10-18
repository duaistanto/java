function FeaturedPost(options) {
  (function ($) {
    var settings = {
      blogURL: "",
      MaxPost: 5,
      idcontaint: "#featuredpost",
      ImageSize: 500,
      interval: 10000,
      autoplay: false,
      loadingClass: "loadingxx",
      pBlank: "https://3.bp.blogspot.com/-v45kaX-IHKo/VDgZxWv0xUI/AAAAAAAAHAo/QJQf8Dlh3xc/s1600/grey.gif",
      MonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      tagName: false
    };

    // Merge user options with defaults
    settings = $.extend({}, settings, options);

    var container = $(settings.idcontaint);
    var blogURL = settings.blogURL;
    var delay = settings.MaxPost * 200;

    if (blogURL === "") {
      blogURL = window.location.protocol + "//" + window.location.host;
    }

    container.html(
      '<div id="slides"><ul class="randomnya"></ul></div>' +
      '<div id="buttons">' +
      '<a href="#" id="prevx" title="prev"></a>' +
      '<a href="#" id="nextx" title="next"></a>' +
      '</div>'
    ).addClass(settings.loadingClass);

    // Function to build the post list from feed data
    function buildPosts(feedData) {
      var entries = feedData.feed.entry;
      var html = "";

      for (var i = 0; i < entries.length; i++) {
        var post = entries[i];
        var postURL = "";
        for (var j = 0; j < post.link.length; j++) {
          if (post.link[j].rel === "alternate") {
            postURL = post.link[j].href;
            break;
          }
        }

        var thumbnail = settings.pBlank;
        if ("media$thumbnail" in post) {
          thumbnail = post.media$thumbnail.url.replace(/\/s[0-9]+\-c/g, "/s" + settings.ImageSize + "-c");
        }

        var title = post.title.$t;
        var publishedDate = post.published.$t.substring(0, 10);
        var author = post.author[0].name.$t;

        var year = publishedDate.substring(0, 4);
        var month = parseInt(publishedDate.substring(5, 7), 10);
        var day = publishedDate.substring(8, 10);
        var monthName = settings.MonthNames[month - 1];

        html +=
          '<li>' +
          '<a target="_blank" href="' + postURL + '" title="' + title + '">' +
          '<div class="overlayx"></div>' +
          '<img class="random" src="' + thumbnail + '" title="' + title + '">' +
          '<h4>' + title + '</h4>' +
          '</a>' +
          '<div class="label_text">' +
          '<span class="date">' +
          '<span class="dd">' + day + '</span> ' +
          '<span class="dm">' + monthName + '</span> ' +
          '<span class="dy">' + year + '</span>' +
          '</span> ' +
          '<span class="autname">' + author + '</span>' +
          '</div>' +
          '</li>';
      }

      $("ul", container).append(html);
    }

    // Function to fetch posts from blog feed
    function fetchPosts() {
      var tagPath = "";
      if (settings.tagName !== false) {
        tagPath = "/-/" + settings.tagName;
      }

      $.ajax({
        url: blogURL + "/feeds/posts/default" + tagPath + "?max-results=" + settings.MaxPost + "&orderby=published&alt=json-in-script",
        success: buildPosts,
        dataType: "jsonp",
        cache: true
      });

      $(function () {
        setTimeout(function () {
          $("#prevx").click(function () {
            $("#slides li:first").before($("#slides li:last"));
            return false;
          });

          $("#nextx").click(function () {
            $("#slides li:last").after($("#slides li:first"));
            return false;
          });

          if (settings.autoplay) {
            var interval = settings.interval;
            var slideInterval = setInterval(rotate, interval);

            $("#slides").hover(
              function () { clearInterval(slideInterval); },
              function () { slideInterval = setInterval(rotate, interval); }
            );

            function rotate() {
              $("#nextx").click();
            }

            $("#slides li:first").before($("#slides li:last"));
          }

          container.removeClass(settings.loadingClass);
        }, delay);
      });
    }

    $(document).ready(fetchPosts);

  })(jQuery);
}
