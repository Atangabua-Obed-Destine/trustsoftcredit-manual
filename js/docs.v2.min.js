"use strict";

$(document).ready(function (e) {
  var copyPreSelectors = $(".document-content pre").not('.codeSnippet pre');
  if (copyPreSelectors.length > 0) {
    var _loop = function _loop() {
      // create hidden copy button
      var preBlock = $(copyPreSelectors[i]);
      preBlock.css({
        "position": "relative"
      });
      var newCopyButton = $("<button class='btn btn-secondary btn-sm copyButton clipboard' style='display: none; position: absolute; top: 0px; right: 10px;'><span class=\"far fa-clipboard\"></span> Copy</button>");
      newCopyButton.on('click', function () {
        // inside this copied block is the button we put in there, remove the button before copying to clipboard
        // first we clone the jquery element into memory so we dont mutate the real one by accident
        var copyBlock = preBlock.clone();
        // remove the button
        copyBlock.find('button').remove();

        // take a snapshot of the html
        var copyText = copyBlock.html();

        // decode the html, by creating a textarea element, pasting it, and copying it back
        var txt = document.createElement("textarea");
        txt.innerHTML = copyText;
        copyText = txt.value;
        var html_formatting_tags = ['b', 'i', 'u', 'strong', 'em', 'i', 'mark', 'small', 'del', 'ins', 'sub', 'sup', 'big'];
        var re_tags = new RegExp("<s*/?s*(".concat(html_formatting_tags.join('|'), ")s*>"), 'gm');
        copyText = copyText.replace(re_tags, '');

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText);
      });
      preBlock.append(newCopyButton);

      // show hidden button on hover
      preBlock.hover(function () {
        newCopyButton.css({
          "display": "inline-block"
        });
      },
      // Hide again when 'out'
      function () {
        newCopyButton.css({
          "display": "none"
        });
      });
    };
    for (var i = 0; i < copyPreSelectors.length; i++) {
      _loop();
    }
  }
  $('.clipboard').tooltip({
    'title': 'Copied!',
    'placement': 'top',
    'trigger': 'click'
  });
  $('.clipboard').on('shown.bs.tooltip', function () {
    setTimeout(function () {
      $('.clipboard').tooltip('hide');
    }, 2000);
  });
  $('[data-toggle="tooltip"]').tooltip({
    show: null,
    position: {
      my: "right top",
      at: "right bottom"
    },
    open: function open(event, ui) {
      ui.tooltip.animate({
        top: ui.tooltip.position().top + 10
      }, "fast");
    }
  });
  new ClipboardJS('.clipboard');
  $('[data-show-udid]').hover(function (e) {
    $(this).find('.display-udid').toggle();
  });
});
"use strict";

/**
 * docs-faq jquery component
 * replaces the old angularjs directive, and even enhances it a little
 * @author Kyle Harrison <kharrison@fortinet.com>
 */
$(function () {
  var faqEls = $("docs-faq");
  if (faqEls.length > 0) {
    faqEls.each(function () {
      // collect all FAQ tags and gather the data
      var qEls = $(this).find("faq");
      if (qEls.length > 0) {
        qEls.each(function () {
          var question = {
            "q": $(this).attr("question"),
            "a": $(this).html()
          };
          var questionEl = $("<div class=\"question\">".concat(question.q, " <i class=\"fas fa-plus\"></i></div>"));
          var answerEl = $("<div class=\"answer\">".concat(question.a, "</div>"));
          questionEl.click(function () {
            $(this).toggleClass('exposed');
            var iconEl = $(this).find(".fas");
            if ($(this).hasClass('exposed')) {
              answerEl.slideDown();
              iconEl.removeClass('fa-plus');
              iconEl.addClass("fa-minus");
            } else {
              answerEl.slideUp();
              iconEl.removeClass('fa-minus');
              iconEl.addClass("fa-plus");
            }
          });
          $(this).empty(); // clear the content
          $(this).append(questionEl);
          $(this).append(answerEl);
        });
      }
    });
  }
});
"use strict";

$(document).ready(function (e) {
  // Search box
  var searchDocument = $(".document-search");
  if (searchDocument.length > 0) {
    $(searchDocument).autoComplete({
      source: function source(term, response) {
        $.getJSON('/test/', {
          q: term
        }, function (data) {
          response(data);
        });
      }

      // renderItem: function(item, search) {
      //     search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      //     var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
      //     return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
      // }
    });
  }
});
"use strict";

var HardwareFilterLabelEl = $(".hardware-guides-filter").parent().children('label');
var AllProductsFilterLabelEl = $(".product-filter").parent().children('label');
$(".product-filter, .hardware-guides-filter").click(function (e) {
  $(this).parent().children('label').addClass('floating-label');
});
$(".product-column-category-link-subcategory, .ftnt-header-v4").click(function (e) {
  if ($(e.target).closest(".product-column-row").length === 0) {
    if (HardwareFilterLabelEl.hasClass('floating-label')) {
      HardwareFilterLabelEl.removeClass('floating-label');
    }
    if (AllProductsFilterLabelEl.hasClass('floating-label')) {
      AllProductsFilterLabelEl.removeClass('floating-label');
    }
  }
});
"use strict";

// START: jQuery Combobox Plugin, source: https://jqueryui.com/autocomplete/#combobox
$.widget("custom.combobox", {
  _create: function _create() {
    this.wrapper = $("<span>").addClass("custom-combobox").insertAfter(this.element);
    this.element.hide();
    this._createAutocomplete();
    this._createShowAllButton();
  },
  _createAutocomplete: function _createAutocomplete() {
    var _this$options$placeho;
    var selected = this.element.children(":selected"),
      value = selected.val() ? selected.text() : "";
    var placeholder = (_this$options$placeho = this.options.placeholderText) !== null && _this$options$placeho !== void 0 ? _this$options$placeho : "Search ...";
    this.input = $("<input>").appendTo(this.wrapper).val(value).attr("title", "").attr("placeholder", placeholder).addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left").autocomplete({
      delay: 0,
      minLength: 0,
      source: this._source.bind(this)
    }).tooltip({
      classes: {
        "ui-tooltip": "ui-state-highlight"
      }
    });
    this._on(this.input, {
      autocompleteselect: function autocompleteselect(event, ui) {
        ui.item.option.selected = true;
        this._trigger("select", event, {
          item: ui.item.option
        });
      },
      autocompletechange: "_removeIfInvalid"
    });
  },
  _createShowAllButton: function _createShowAllButton() {
    var input = this.input,
      wasOpen = false;
    $("<a>").attr("tabIndex", -1).attr("title", "Show All Items").tooltip().appendTo(this.wrapper).button({
      icons: {
        primary: "ui-icon-triangle-1-s"
      },
      text: false
    }).removeClass("ui-corner-all").addClass("custom-combobox-toggle ui-corner-right").on("mousedown", function () {
      wasOpen = input.autocomplete("widget").is(":visible");
    }).on("click", function () {
      input.trigger("focus");

      // Close if already visible
      if (wasOpen) {
        return;
      }

      // Pass empty string as value to search for, displaying all results
      input.autocomplete("search", "");
    });
  },
  _source: function _source(request, response) {
    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
    response(this.element.children("option").map(function () {
      var text = $(this).text();
      if (this.value && (!request.term || matcher.test(text))) return {
        label: text,
        value: text,
        option: this
      };
    }));
  },
  _removeIfInvalid: function _removeIfInvalid(event, ui) {
    // Selected an item, nothing to do
    if (ui.item) {
      return;
    }

    // Search for a match (case-insensitive)
    var value = this.input.val(),
      valueLowerCase = value.toLowerCase(),
      valid = false;
    this.element.children("option").each(function () {
      if ($(this).text().toLowerCase() === valueLowerCase) {
        this.selected = valid = true;
        return false;
      }
    });

    // Found a match, nothing to do
    if (valid) {
      return;
    }

    // Remove invalid value
    this.input.val("").attr("title", value + " didn't match any item").tooltip("open");
    this.element.val("");
    this._delay(function () {
      this.input.tooltip("close").attr("title", "");
    }, 2500);
    this.input.autocomplete("instance").term = "";
  },
  _destroy: function _destroy() {
    this.wrapper.remove();
    this.element.show();
  }
});
// END: jQuery Combobox Plugin, source: https://jqueryui.com/autocomplete/#combobox
"use strict";

var madcapCodeSnippetCopyButtons = $(".codeSnippetCopyButton");
if (madcapCodeSnippetCopyButtons.length > 0) {
  madcapCodeSnippetCopyButtons.addClass('btn btn-sm btn-secondary');
  madcapCodeSnippetCopyButtons.parents('.codeSnippet').hover(function (e) {
    $(this).children('.codeSnippetCopyButton').toggle();
  });
  madcapCodeSnippetCopyButtons.on('click', function (e) {
    e.preventDefault();
    var $temp = $("<div>");
    var $element = $('code', $(this).parents(".codeSnippet"));
    var text = $temp.html($element.html().replace(/<br>/g, "\n")).text();
    $temp = $("<textarea>");
    $element.parent().append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
  });
}
"use strict";

$(document).ready(function (e) {
  // Fancy Dropdown
  $(".msdd").msDropdown({
    mainCSS: "dd fortinetblue",
    on: {
      change: function change(data, ui) {
        var val = data.value;
        if (val != "") window.location = val;
      }
    }
  });
  $(".msdd10").msDropdown({
    mainCSS: "dd fortinetblue",
    visibleRows: 10,
    on: {
      change: function change(data, ui) {
        var val = data.value;
        if (val != "") window.location = val;
      }
    }
  });
  $(".video").modalVideo({
    title: "TEST"
  });
  $('#filter_products').keyup(function () {
    var keyword = $(this).val();
    $('.all-products .product').each(function () {
      if ($(this).find('span').html().toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
    if (keyword == '') {
      $('.all-products .product').show();
    }
  });
});
"use strict";

$(document).ready(function (e) {
  // apply table styles
  $(".column_right table").toggleClass("table", true).toggleClass("table-striped", true).toggleClass("table-bordered", true).toggleClass("table-sm", true);
  $(".column_right thead").toggleClass("thead-dark");
});
"use strict";

$(document).ready(function (e) {
  //mobile menu
  $('#mobile_menu_btn').click(function () {
    $('#mobile_menu').toggleClass('show');
    $('body').toggleClass('offcanvas show');
    $('.side-menu').toggleClass('offcanvas');
  });

  //side menu
  $('#side_menu_main_btn').click(function () {
    var sideMenuItem = $('.side-menu-item ');
    sideMenuItem.toggleClass('show');
    if (sideMenuItem.hasClass('show')) {
      $(this).html('<i class="fas fa-minus"></i>');
    } else {
      $(this).html('<i class="fas fa-plus"></i>');
    }
  });
});
"use strict";

function smoothScrollToAnchor(nameanchor) {
  var headerHeight = $(".ftnt-header-v4").outerHeight();
  var extraOffset = 25;

  // find the real anchor in the page
  var anchorEl = $("a[name=\"".concat(nameanchor, "\"]"));
  if (anchorEl.length > 0) {
    // found matching page anchor, scroll to it
    anchorEl = anchorEl[0]; // only care about the first one

    var topvalue = $(anchorEl).offset().top - headerHeight - extraOffset;
    // console.log($(anchorEl).offset().top, "-", headerHeight, " = ", topvalue);

    $("html, body").animate({
      scrollTop: topvalue
    });
  }
  window.location.hash = nameanchor;
}
"use strict";

$(document).ready(function (e) {
  /*
   * Replace all SVG images with inline SVG
   */
  jQuery('img.svg').each(function () {
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');
    jQuery.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

      // Add replaced image's ID to the new SVG
      if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
      if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
        $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
      }

      // Replace image with new SVG
      $img.replaceWith($svg);
    }, 'xml');
  });
});
"use strict";

$(document).ready(function (e) {
  $("li.toc ul").hide();
  $("li.toc").on("click", function (a) {
    a.stopPropagation();
    var target = a.target;
    var jtarget = $(a.target);

    // this allows clicking a nested item (for styling purposes) to still react like it should
    if ("SPAN" === target.nodeName) {
      jtarget = jtarget.parent("li");
    }
    if ("LI" === jtarget.prop('nodeName') && (jtarget.hasClass("closed") || jtarget.hasClass("opened")) && jtarget.toggleClass("closed opened")) {
      jtarget.hasClass("closed") && jtarget.children("ul").hide();
      jtarget.hasClass("opened") && jtarget.children("ul").show();
    }
  });
  $("li.toc.selected").each(function () {
    $(this).parents("li.toc.closed").each(function () {
      $(this).toggleClass("closed opened");
      // $(this).toggleClass("");
      $(this).children("ul").show();
    });
    $(this).toggleClass("closed opened").children("ul").show();
  });
  $(".column_left strong .toc").click(function () {
    var autoScrollElement = $(this);
    $(".column_left").animate({
      scrollTop: 0
    }, 0);
    setTimeout(function () {
      //do something special

      // $(".column_left").animate({
      //     scrollTop: autoScrollElement.offset().top  - $(".ftnt-multi-col").offset().top
      // }, 0);
    }, 500);
  });

  // $(document).ready(function(){
  //     let elId = location.hash.replace('#','');
  //     const anchorElement = $("a[name='" + elId + "']");
  //     if(anchorElement.length > 0) {
  //         $(".column_center").animate({
  //             scrollTop: anchorElement.offset().top - $(".ftnt-multi-col").offset().top
  //         }, 0);
  //     }
  //
  // });

  // setTimeout(
  //     function()
  //     {
  //         //do something special
  //         var autoScrollElement = $(".column_left strong .toc");
  //         var pathname = window.location.href;
  //         var origin   = window.location.origin;
  //
  //         if (autoScrollElement.length > 0) {
  //             autoScrollElement.each(function(index, elem){
  //                 var href_link = $(elem).attr('href');
  //
  //                 if( (origin + href_link) == pathname ) {
  //                     $(".column_left").animate({
  //                         scrollTop: $(elem).offset().top - $(".ftnt-multi-col").offset().top
  //                     }, 0);
  //
  //
  //                     return;
  //                 }
  //
  //             });
  //             // $(".column_left").animate({
  //             //     scrollTop: $(autoScrollElement).offset().top - $(".ftnt-multi-col").offset().top
  //             // }, 0);
  //         }
  //
  //     }, 500);
  //
  // setTimeout(
  //     function()
  //     {
  //         //do something special
  //         var autoScrollElement = $("#mobile_menu strong .toc");
  //
  //         if (autoScrollElement.length > 0) {
  //             $("#mobile_menu").animate({
  //                 scrollTop: $(autoScrollElement).offset().top - $(".ftnt-multi-col").offset().top - 30
  //             }, 0);
  //         }
  //     }, 500);
});

$(function () {
  if (window.location.hash !== '' && window.location.hash !== '#') {
    setTimeout(function () {
      // we have a valid hash to pay attention too on load, animate body
      // Get the ID of the target
      var hrefanchor = window.location.hash;
      var nameanchor = hrefanchor.split('').slice(1).join('');
      var headerHeight = $(".ftnt-header-v5").outerHeight();
      var extraOffset = 63;
      // find the real anchor in the page
      var anchorEl = $("a[name=\"".concat(nameanchor, "\"]"));
      if (anchorEl.length > 0) {
        // found matching page anchor, scroll to it
        anchorEl = anchorEl[0]; // only care about the first one
        var topvalue = $(anchorEl).offset().top - headerHeight - extraOffset;
        // console.log($(anchorEl).offset().top, "-", headerHeight, " = ", topvalue);

        $("html, body").animate({
          scrollTop: topvalue
        });
      }
    }, 500);
  }

  // Only trigger .click() event when the link points to an internal anchor
  $("a[href*='#']").click(function (e) {
    // Get the ID of the target
    var hrefanchor = $(e.target).attr("href");
    if (hrefanchor.indexOf(window.location.pathname) === -1 && hrefanchor.indexOf('#') !== 0) {
      return;
    }
    var nameanchor = hrefanchor.replace(window.location.pathname, '').split('').slice(1).join('');
    var headerHeight = $(".ftnt-header-v5").outerHeight();
    var extraOffset = 70;

    // find the real anchor in the page
    var anchorEl = $("a[name=\"".concat(nameanchor, "\"]"));
    if (anchorEl.length > 0) {
      // found matching page anchor, scroll to it
      anchorEl = anchorEl[0]; // only care about the first one
      var topvalue = $(anchorEl).offset().top - headerHeight - extraOffset;
      // console.log($(anchorEl).offset().top, "-", headerHeight, " = ", topvalue);

      $("html, body").animate({
        scrollTop: topvalue
      });
    }
    window.location.hash = hrefanchor;
    e.preventDefault();
  });
});
"use strict";

$(document).ready(function (e) {
  // Typeahead Search system
  var elSuggestions = $(".document-search .suggestions");
  var lastXhrRequest = null;
  if (elSuggestions.length) {
    var context_document = elSuggestions.data("document");
    var elSearchInput = $(".document-search input");
    elSearchInput.on('focus', function (e) {
      elSuggestions.show();
    });
    elSearchInput.keyup(function (e) {
      var val = $(this).val().toLowerCase();
      var matchers = [];
      for (var l = val.length; l > 0; l--) matchers.push(val.substr(0, l));
      if (val.length > 2) {
        if (lastXhrRequest != null) {
          lastXhrRequest.abort();
        }
        lastXhrRequest = $.ajax({
          url: "/search/suggest/page?q=" + val + "&d=" + context_document,
          success: function success(_success) {
            // remove existing suggestions
            elSuggestions.children().each(function () {
              $(this).remove();
            });
            for (var i = 0; i < _success.s.length; i++) {
              var o = _success.s[i];
              var title = o.title;
              for (var m = 0; m < matchers.length; m++) {
                var strStart = title.toLowerCase().indexOf(matchers[m]);
                if (strStart >= 0) {
                  // put in end tag first
                  title = title.slice(0, strStart + matchers[m].length) + "</span>" + title.slice(strStart + matchers[m].length);
                  title = title.slice(0, strStart) + "<span class='match'>" + title.slice(strStart);
                  break;
                }
              }
              $("<div class=\"suggestion\"><a href=\"" + o.path + "\">" + title + "</a></div>").appendTo(elSuggestions);
            }

            // console.log("Success", success);
          }
        });
      }
    });
  }
});
"use strict";

function setupMenuFilter(elFilter, elProductListContainer, elProductList) {
  var elProductListOriginal = Object.assign(elProductList);
  function refreshProductList() {
    elProductListContainer.empty();
    elProductListContainer.append(elProductList);
  }
  elFilter.keyup(function () {
    var val = elFilter.val().trim().toLowerCase();
    if (val === '') {
      elProductList = elProductListOriginal;
    } else {
      var tmpList = [];
      for (var i = 0; i < elProductListOriginal.length; i++) {
        var elProduct = $(elProductListOriginal[i]);
        var productTerms = elProduct.data("terms").split(',');
        for (var t = 0; t < productTerms.length; t++) {
          var _term = productTerms[t].toLowerCase();
          if (_term.indexOf(val) > -1) {
            tmpList.push(elProduct);
            break;
          }
        }
      }
      elProductList = tmpList;
    }
    refreshProductList();
  });
  refreshProductList();
}
$(document).ready(function (e) {
  // Hardware Menu Filter
  setupMenuFilter($(".ftnt-pillar-drop.hardware-guides input.hardware-guides-filter"), $(".ftnt-pillar-drop.hardware-guides .hardware-list"), $(".ftnt-pillar-drop.hardware-guides .hardware-list a"));

  // All Products Menu Filter
  setupMenuFilter($(".ftnt-pillar-drop.all-products input.product-filter"), $(".ftnt-pillar-drop.all-products .product-list"), $(".ftnt-pillar-drop.all-products .product-list a"));
  $(document).click(function (e) {
    var shownMenuPillars = $(".ftnt-pillars > .ftnt-pillar-item .ftnt-pillar-drop.show, .ftnt-search .search-bar.show");
    // console.log(shownMenuPillars);
    shownMenuPillars.removeClass('show');
  });
  function ftntPillarsToggleDrop(e) {
    e.stopPropagation(); // prevent anything underneath (like the (document)) from getting clicks
    var $context = $(this);
    // Toggle the class
    $(".ftnt-pillars > .ftnt-pillar-item, .ftnt-search").each(function () {
      var $contextDrop = $context.find('.ftnt-pillar-drop, .search-bar');
      var $elementDrop = $(this).find('.ftnt-pillar-drop, .search-bar');
      if ($contextDrop.is($elementDrop)) {
        $elementDrop.toggleClass('show');
      } else {
        $elementDrop.removeClass('show');
      }
    });
  }
  $(".ftnt-pillars > .ftnt-pillar-item, .ftnt-search").click(ftntPillarsToggleDrop);

  // prevent clicking inside the pillar-item from closing the menu prematurely
  $(".ftnt-pillars > .ftnt-pillar-item .ftnt-pillar-drop, .ftnt-search .search-bar").click(function (e) {
    e.stopPropagation();
  });
});
"use strict";

$(document).ready(function () {
  $(".hardware-doc-type").click(function () {
    $(this).toggleClass('selected-model');
    var doc_type = $(this).find("h5").text();
    if ($(this).hasClass('selected-model')) {
      filterDocuments(doc_type);
      var elDocumentFilterContainer = $(".document-filter-container");
      window.scrollTo(0, elDocumentFilterContainer.offset().top);
    } else {
      displayAllDocuments();
    }
  });
  function filterDocuments(doc_type) {
    $(".hardware-document-type").each(function () {
      if (!$(this).hasClass(doc_type)) {
        $(this).hide();
      }
    });
  }
  function displayAllDocuments() {
    $('div.hardware-document-type').each(function () {
      $(this).show();
    });
  }
});
"use strict";

$(document).ready(function () {
  var elHardwareFilterBox = $("#filter-documents");
  if (elHardwareFilterBox.length > 0) {
    // models
    var elHWModels = $(".hardware-document-type");
    var elHWModelsOriginal = Object.assign(elHWModels);
    elHardwareFilterBox.keyup(function () {
      // normalize the search value
      var elSearchVal = $(this).val().trim().toLowerCase();

      // iterate through the models to get to the cards
      for (var m = 0; m < elHWModelsOriginal.length; m++) {
        // inside this model, we must filter its product cards
        var _hwModel = $(elHWModelsOriginal[m]);
        _hwModel.show();

        // this is for if there are no cards left in the model, we'll just skip it entirely
        var doIncludeModel = false;

        // gather all of this models product cards and iterate through them
        var documentCards = _hwModel.find(".product-card");
        for (var d = 0; d < documentCards.length; d++) {
          // got a handle on this card
          var _docCard = $(documentCards[d]);
          _docCard.show();

          // normalize card title field text and perform a fuzzy match
          var _docCardTitleText = _docCard.find(".product-card-title a").first().text().trim().toLowerCase();

          // if string is found inside card, move on, and set the includer to true
          if (_docCardTitleText.indexOf(elSearchVal) > -1) {
            doIncludeModel = true;
            continue;
          }

          // if string is not found inside card, remove it
          _docCard.hide();
        }
        if (!doIncludeModel) {
          _hwModel.hide();
        }
      }
    });
  }
});
"use strict";

function composeTempList(q, originalProductList) {
  var elProductsList = [];
  if (q !== '') {
    var tempList = [];
    for (var i = 0; i < originalProductList.length; i++) {
      var elProduct = $(originalProductList[i]);
      var productTerms = elProduct.data("terms").split(',');
      for (var t = 0; t < productTerms.length; t++) {
        var _term = productTerms[t].toLowerCase();
        if (_term.indexOf(q) > -1) {
          tempList.push(elProduct);
          break;
        }
      }
    }
    elProductsList = tempList;
  } else {
    elProductsList = originalProductList;
  }
  return elProductsList;
}
function refreshList(product_list, list_type) {
  var ElementMappings = {
    'hardware_guides': {
      'container': $(".hardware-guides-menu-category-items"),
      'li-class-name': 'hardware-guides-menu-category-item'
    },
    'products_az': {
      'container': $(".products-az-menu-category-items"),
      'li-class-name': 'products-az-menu-category-item'
    }
  };
  var elements = ElementMappings[list_type];
  var list_length = product_list.length;
  elements.container.empty();
  for (var i = 0; i < list_length; i++) {
    elements['container'].append("\n            <li class=\"".concat(elements['li-class-name'], "\">\n                <a href=\"").concat($(product_list[i]).prop("href"), "\" data-terms=\"").concat($(product_list[i]).data('terms'), "\">\n                    ").concat($(product_list[i]).text(), "\n                </a>\n            </li>\n        "));
  }
}
$(document).ready(function () {
  var originalHardwareGuidesList = Object.assign($(".hardware-guides-menu-category-items .hardware-guides-menu-category-item a"));
  var orginalProductsAZList = Object.assign($(".products-az-menu-category-items .products-az-menu-category-item a"));
  function adjustMenuHeight(height, menu_type) {
    var elements = {
      'products_menu': $(".ftnt-products-menu, .secondary-submenu, .site-nav-v5"),
      'best_practices_menu': $(".ftnt-best-practices-menu, .site-nav-v5")
    };
    elements[menu_type].css({
      height: "".concat(height, "px"),
      maxHeight: "".concat(height, "px")
    });
  }
  function hideElements(elements) {
    elements.forEach(function () {
      elements.forEach(function ($el) {
        $el.removeClass("active menu-item-selected selected");
      });
    });
  }

  // "More >>" links on the Products > Summary Menu

  $(".secure-networking-more").click(function () {
    $(".products-by-solution-button").click();
  });
  $(".unified-sase-more").click(function () {
    $(".solution-unified-sase").click();
  });
  $(".security-operations-more").click(function () {
    $(".solution-security-operations").click();
  });

  // Products Menu
  $(".products-menu-button").click(function () {
    var elProductsMenuContainer = $(".ftnt-products-v5");
    var has_class = elProductsMenuContainer.hasClass("active");
    hideElements([$(".ftnt-menus-v5 div"), $(".products-submenu > div"), $(".search-bar")]);
    if (has_class) {
      elProductsMenuContainer.removeClass("active");
    } else {
      elProductsMenuContainer.addClass("active");
      $(".products-menu-summary").addClass("active");
      $(".submenu-item.products-summary").addClass("menu-item-selected");
      $(".ftnt-products-menu").css({
        height: "740px",
        maxHeight: "740px"
      });
    }
    if (elProductsMenuContainer.hasClass("active")) {
      $(".site-nav-v5").css({
        height: "740px",
        maxHeight: "740px"
      });
    } else {
      $(".site-nav-v5").css({
        height: "62px",
        maxHeight: "62px"
      });
    }
  });

  // Products > Summary
  $(".products-summary").click(function () {
    hideElements([$(".menu-components > div"), $(".secondary-submenu"), $(".products-submenu > div")]);
    $(this).addClass('menu-item-selected');
    $(".products-menu-summary").addClass('active');
    adjustMenuHeight(740, 'products_menu');
  });

  // Products > By Solution , Products > By Solution > Secure Networking
  $(".products-by-solution-button, .solution-secure-networking").click(function () {
    hideElements([$(".menu-components > div"), $(".secondary-submenu"), $(".secondary-submenu > div"), $(".products-submenu > div")]);
    $(this).addClass('menu-item-selected');
    $(".products-by-solution-button").addClass('menu-item-selected');
    $(".secondary-submenu.solution-secondary-menu").addClass("active");
    $(".solution-secure-networking").addClass("active").addClass("selected");
    $(".solution-secure-networking-menu").addClass("active");
    adjustMenuHeight(420, 'products_menu');
  });

  // Products > By Solution > Unified SASE
  $(".solution-unified-sase").click(function () {
    hideElements([$(".menu-components > div"), $(".secondary-submenu > div"), $(".products-submenu > div"), $(".cloud-secondary-menu > div"), $(".d-pillars-secondary-menu > div")]);
    $(this).addClass('menu-item-selected');
    $(".products-by-solution-button").addClass('menu-item-selected');
    $(".secondary-submenu.solution-secondary-menu").addClass("active");
    $(this).addClass("selected");
    $(".solution-unified-sase-menu").addClass('active');
    adjustMenuHeight(450, 'products_menu');
  });

  // Products > By Solution > Security Operations
  $(".solution-security-operations").click(function () {
    hideElements([$(".menu-components > div"), $(".secondary-submenu"), $(".secondary-submenu.solution-secondary-menu > div"), $(".secondary-submenu > div"), $(".products-submenu > div")]);
    $(".secondary-submenu.solution-secondary-menu").addClass("active");
    $(".products-by-solution-button").addClass('menu-item-selected');
    $(this).addClass("selected");
    $(".solution-security-operations-menu").addClass('active');
    adjustMenuHeight(535, 'products_menu');
  });

  // Proucts > By 4D Pillars
  $(".products-by-4d-pillars").click(function () {
    hideElements([$(".menu-components > div"), $(".secondary-submenu"), $(".secondary-submenu.d-pillars-secondary-menu > div"), $(".secondary-submenu > div"), $(".products-submenu > div")]);
    $(this).addClass("menu-item-selected");
    $(".secondary-submenu.d-pillars-secondary-menu").addClass("active");
    $(".d-pillars-sdwan").addClass('selected');
    $(".products-menu-by-4d-pillars.d-pillars-sdwan-menu").addClass("active");
    adjustMenuHeight(376, 'products_menu');
  });

  // Products > By 4D Pillars > Secure SD WAN
  $(".d-pillars-sdwan").click(function () {
    hideElements([$(".menu-components div"), $(".secondary-submenu.d-pillars-secondary-menu > div")]);
    $(this).addClass("selected");
    $(".submenu-item.products-by-4d-pillars").addClass("menu-item-selected");
    $(".d-pillars-sdwan-menu").addClass('active');
  });

  // Products > By 4D Pillars > Secure Access Service Edge (SASE)
  $(".d-pillars-sase").click(function () {
    hideElements([$(".menu-components div"), $(".secondary-submenu.d-pillars-secondary-menu > div")]);
    $(this).addClass("selected");
    $(".submenu-item.products-by-4d-pillars").addClass("menu-item-selected");
    $(".d-pillars-sase-menu").addClass('active');
  });

  // Products > By 4D Pillars > ZTNA
  $(".d-pillars-ztna").click(function () {
    hideElements([$(".menu-components div"), $(".secondary-submenu.d-pillars-secondary-menu > div")]);
    $(this).addClass("selected");
    $(".submenu-item.products-by-4d-pillars").addClass("menu-item-selected");
    $(".d-pillars-ztna-menu").addClass('active');
  });

  // Products > By 4D Pillars > LAN Edge
  $(".d-pillars-lan-edge").click(function () {
    hideElements([$(".menu-components div"), $(".secondary-submenu.d-pillars-secondary-menu > div")]);
    $(this).addClass("selected");
    $(".submenu-item.products-by-4d-pillars").addClass("menu-item-selected");
    $(".d-pillars-lan-edge-menu").addClass('active');
  });

  // Products > By 4D Pillars > Identity and Access Management
  $(".d-pillars-iam").click(function () {
    hideElements([$(".menu-components div"), $(".secondary-submenu.d-pillars-secondary-menu > div")]);
    $(this).addClass("selected");
    $(".submenu-item.products-by-4d-pillars").addClass("menu-item-selected");
    $(".d-pillars-iam-menu").addClass('active');
  });

  // Products > By 4D Pillars > Next Generation Firewall
  $(".d-pillars-ngfw").click(function () {
    hideElements([$(".menu-components div"), $(".secondary-submenu.d-pillars-secondary-menu > div")]);
    $(this).addClass("selected");
    $(".submenu-item.products-by-4d-pillars").addClass("menu-item-selected");
    $(".d-pillars-ngfw-menu").addClass('active');
    adjustMenuHeight(470, 'products_menu');
  });

  // Products > By Cloud
  $(".products-by-cloud").click(function () {
    hideElements([$(".menu-components > div"), $(".products-submenu > div"), $(".secondary-submenu"), $(".secondary-submenu.cloud-secondary-menu > div"), $(".secondary-submenu.solution-secondary-menu > div")]);
    $(this).addClass('menu-item-selected');
    $(".secondary-submenu.cloud-secondary-menu").addClass("active");
    $(".cloud-public-cloud").addClass("selected");
    $(".cloud-public-cloud-menu").addClass("active");
    adjustMenuHeight(590, 'products_menu');
  });

  // Products > By Cloud > Public Cloud
  $(".cloud-public-cloud").click(function () {
    hideElements([$(".menu-components div"), $(".secondary-submenu.cloud-secondary-menu > div")]);
    $(this).addClass("selected");
    $(".submenu-item.products-by-cloud").addClass("menu-item-selected");
    $(".cloud-public-cloud-menu").addClass('active');
  });

  // Products > By Cloud > Private Cloud
  $(".cloud-private-cloud").click(function () {
    hideElements([$(".menu-components div"), $(".secondary-submenu.cloud-secondary-menu > div")]);
    $(this).addClass("selected");
    $(".submenu-item.products-by-cloud").addClass("menu-item-selected");
    $(".cloud-private-cloud-menu").addClass('active');
  });

  // Products > By Cloud > FortiCloud
  $(".cloud-forticloud").click(function () {
    hideElements([$(".menu-components div"), $(".secondary-submenu.cloud-secondary-menu > div")]);
    $(this).addClass("selected");
    $(".submenu-item.products-by-cloud").addClass("menu-item-selected");
    $(".cloud-forticloud-menu").addClass('active');
    adjustMenuHeight(750, 'products_menu');
  });

  // Best Practices
  $(".best-practices-menu-button").click(function () {
    var elBestPracticesMenuContainer = $(".ftnt-best-practices-v5");
    var has_class = elBestPracticesMenuContainer.hasClass("active");
    hideElements([$(".ftnt-menus-v5 div"), $(".bp-submenu > div"), $(".search-bar")]);
    if (has_class) {
      elBestPracticesMenuContainer.removeClass("active");
    } else {
      elBestPracticesMenuContainer.addClass("active");
      $(".bp-menu-by-d-resources").addClass("active");
      $(".bp-by-d-resources").addClass("menu-item-selected");
      $(".ftnt-best-practices-menu").css({
        height: "366px",
        maxHeight: "366px"
      });
    }
    if (elBestPracticesMenuContainer.hasClass("active")) {
      $(".site-nav-v5").css({
        height: "366px",
        maxHeight: "366px"
      });
    } else {
      $(".site-nav-v5").css({
        height: "62px",
        maxHeight: "62px"
      });
    }
  });

  // Best Practices > By 4D Resources
  $(".bp-by-d-resources").click(function () {
    hideElements([$(".menu-components div"), $(".bp-submenu > div")]);
    $(this).addClass('menu-item-selected');
    $(".bp-menu-by-d-resources").addClass('active');
    adjustMenuHeight(366, 'best_practices_menu');
  });

  // Best Practices > Solution Hubs
  $(".bp-by-solution-hubs").click(function () {
    hideElements([$(".menu-components div"), $(".bp-submenu > div")]);
    $(this).addClass('menu-item-selected');
    $(".bp-menu-by-solution-hubs").addClass('active');
    adjustMenuHeight(590, 'best_practices_menu');
  });

  // Hardware Guides
  $(".hardware-guides-menu-button").click(function () {
    var elHardwareGuidesMenuContainer = $(".ftnt-hardware-guides-v5");
    var has_class = elHardwareGuidesMenuContainer.hasClass("active");
    hideElements([$(".ftnt-menus-v5 div"), $(".search-bar")]);
    if (has_class) {
      elHardwareGuidesMenuContainer.removeClass("active");
    } else {
      elHardwareGuidesMenuContainer.addClass("active");
      $(".ftnt-hardware-guides-menu").css({
        height: "500px",
        maxHeight: "500px"
      });
    }
    if (elHardwareGuidesMenuContainer.hasClass("active")) {
      $(".site-nav-v5").css({
        height: "500px",
        maxHeight: "500px"
      });
    } else {
      $(".site-nav-v5").css({
        height: "62px",
        maxHeight: "62px"
      });
    }
  });

  // Products A-Z
  $(".products-az-menu-button").click(function () {
    var elProductsAZMenuContainer = $(".ftnt-products-az-v5");
    var has_class = elProductsAZMenuContainer.hasClass("active");
    hideElements([$(".ftnt-menus-v5 div"), $(".search-bar")]);
    if (has_class) {
      elProductsAZMenuContainer.removeClass("active");
    } else {
      elProductsAZMenuContainer.addClass("active");
    }
    if (elProductsAZMenuContainer.hasClass("active")) {
      $(".site-nav-v5").css({
        height: "850px",
        maxHeight: "850px"
      });
    } else {
      $(".site-nav-v5").css({
        height: "62px",
        maxHeight: "62px"
      });
    }
  });

  // Hardware Guides Menu Search
  $(".hardware-guides-search-input").keyup(function () {
    var q = $(this).val().trim().toLowerCase();
    refreshList(composeTempList(q, originalHardwareGuidesList), 'hardware_guides');
  });

  // Products A-Z Menu Search
  $(".products-az-search-input").keyup(function () {
    var q = $(this).val().trim().toLowerCase();
    refreshList(composeTempList(q, orginalProductsAZList), 'products_az');
  });
  function SearchMenuToggleDrop(e) {
    e.stopPropagation(); // prevent anything underneath (like the (document)) from getting clicks
    hideElements([$(".ftnt-menus-v5 div")]);
    $(".site-nav-v5").css({
      height: "62px",
      maxHeight: "62px"
    });
    var $context = $(this);

    // Toggle the class
    $(".ftnt-search-v5").each(function () {
      var $contextDrop = $context.find('.search-bar');
      var $elementDrop = $(this).find('.search-bar');
      if ($contextDrop.is($elementDrop)) {
        $elementDrop.toggleClass('active');
      } else {
        $elementDrop.removeClass('active');
        $(".site-nav-v5").css("height", "62px");
      }
      if ($elementDrop.hasClass("active")) {
        $(".site-nav-v5").height(861);
      }
    });
  }
  $(".ftnt-search-v5").click(SearchMenuToggleDrop);

  // prevent clicking inside the pillar-item from closing the menu prematurely
  $(".ftnt-search-v5 .search-bar").click(function (e) {
    e.stopPropagation();
  });
});
$(document).on('scroll', function () {
  if (new_menu_ff) {
    var currentScroll = $(window).scrollTop();
    var stickyOffset = 50;
    if (currentScroll > stickyOffset) {
      $(".site-nav-v5").css({
        position: "fixed",
        top: 0,
        zIndex: 999,
        backgroundImage: "url('/img/main-menu-v5/menu-background.png')"
      });
      $(".lhs-container").attr("style", "position: fixed; top: 61px !important;");
      $(".rhs-right-container").css({
        top: 125
      });
      $(".rhs-header-panel").removeClass("top-100").css({
        top: 61,
        position: "fixed"
      });
    } else if (currentScroll <= 1) {
      $(".site-nav-v5").css({
        position: "absolute",
        top: 40,
        backgroundImage: "none"
      });
      $(".lhs-container").attr("style", "position: fixed; top: 100px !important;");
      $(".rhs-right-container").css({
        top: 163
      });
      $(".rhs-header-panel").css({
        top: 100,
        position: "fixed"
      });
    }
  }
});
$(document).click(function (event) {
  var menus = $(".ftnt-products-v5, .ftnt-best-practices-v5, .ftnt-products-az-v5, .ftnt-hardware-guides-v5");
  var elNav = $(".ftnt-header-v5.site-nav-v5");
  if (!elNav.is(event.target) && elNav.has(event.target).length === 0) {
    menus.each(function () {
      var menu = $(this);
      if (menu.hasClass("active")) {
        menu.removeClass("active");
        setTimeout(function () {
          menu.css("visibility", "hidden").css("display", "none");
        }, 500);
      }
      elNav.css("height", 62);
    });
  }
});
"use strict";

$(document).ready(function (e) {
  //dropdown menu for selecting version
  $('.md-dropdown-version').on('show.bs.dropdown', function () {
    $('#dd_select_btn').html('<span>Select version</span> <i class="fas fa-angle-up"></i>');
  });
  $('.md-dropdown-version').on('hide.bs.dropdown', function () {
    $('#dd_select_btn').html('<span>Select version</span> <i class="fas fa-angle-down"></i>');
  });

  //version selector
  // $('.product-section-single .version-item a').click(function (e) {
  //     e.preventDefault();
  //     var product_section = $(this).parents('.product-section');
  //     //remove all selected links
  //     product_section.find('.version-item a').removeClass('selected');
  //     $(this).addClass('selected');
  //
  //     var doc_version_id = $(this).data('version-target');
  //     product_section.find('.doc-version').hide();
  //
  //     //update link for h5 title
  //     var doc_version_href = $(doc_version_id + ' a').attr('href');
  //     $(this).parents('.product-section-single').find('h5 a').attr('href', doc_version_href);
  //
  //     $(doc_version_id).show();
  // });
  //

  $('.product-section-multiple .version-item a').click(function (e) {
    e.preventDefault();
    var product_section = $(this).parents('.product-section-multiple');
    //remove all selected links
    product_section.find('.version-item a').removeClass('selected');
    $(this).addClass('selected');
    var doc_version_class = $(this).data('version-target');
    product_section.find('.product-section-title, .product-section-versions').css('display', 'none');
    product_section.find(doc_version_class).css('display', 'inline-block');
  });

  //init version pre-selected
  $(document).ready(function () {
    $('.product-section-multiple .version-item a.selected').click();
  });
});
"use strict";

$(document).ready(function (e) {
  $('.product-version-container .version-item').click(function (e) {
    e.preventDefault();
    var product_section = $(this).parents('.product-card-content');

    //remove all selected links
    product_section.find('.version-item').removeClass('selected');
    $(this).addClass('selected');
    var doc_version_class = $(this).data('version-target');
    product_section.find('.product-section-title').css('display', 'none');
    product_section.find(doc_version_class).css('display', 'flex');
    $(this).parents(".dropdown").children('.dropbtn').html("<span>Older<i class=\"ml-2 fa fa-angle-down\"></i></span>").removeClass('selected');
  });
  $('.product-version-container .dropdown .dropdown-content-multiple a').click(function (e) {
    e.preventDefault();
    var product_section = $(this).parents('.product-card-content');

    //remove all selected links
    product_section.find('.version-item').removeClass('selected');
    var doc_version_class = $(this).data('version-target');
    product_section.find('.product-section-title').css('display', 'none');
    product_section.find(doc_version_class).css('display', 'flex');
    $(this).parents(".dropdown").children('.dropbtn').html("<span>".concat(e.target.text, "<i class=\"ml-2 fa fa-angle-down\"></i></span>")).addClass('selected');
  });
  $(".product-version-container .dropdown .dropbtn").click(function () {
    $(this).parent().children(".dropdown-content").toggle();
    $(this).parent().children(".dropdown-content-multiple").toggle();
  });
  $('.legacy-dropdown .version-family-item').click(function () {
    $(".legacy-dropdown-content").toggle();
  });
  $(document).click(function (e) {
    if ($(e.target).closest(".legacy-dropdown").length === 0) {
      $(".legacy-dropdown-content").css("display", "none");
    }
    if ($(e.target).closest(".product-version-container div.dropdown").length === 0) {
      $(".product-version-container .dropdown div.dropdown-content").css("display", "none");
      $(".product-version-container .dropdown div.dropdown-content-multiple").css("display", "none");
    }
  });
  function findActiveVersion(family_version) {
    var isLegacyVersion = false;
    $('.legacy-dropdown-content span a').each(function () {
      if ($.trim($(this).text()) === family_version) {
        $(".legacy-dropdown button").removeClass("legacy-version-button").addClass("active").html("<span>".concat(family_version, "<i class=\"fa fa-angle-down ml-2\"></i></span>"));
      }
    });
  }

  //init version pre-selected
  $(document).ready(function () {
    findActiveVersion($(window.location.href.split('/')).get(-1));
    $('.product-section-multiple .version-item a.selected').click();
    $('.product-card-container .product-version-container a.version-item.selected').click();
  });
});
"use strict";

$(function () {
  $('#select_product').selectpicker();
  $('#select_product').change(function () {
    var product_id = $(this).val();
    if (vm_landing_page_path) {
      window.location.replace(vm_landing_page_path + "/" + product_id);
    }
  });
  function get_vm_page(product_id, version_family, type) {
    var result;
    if (vm_pages_path) {
      $.post(vm_pages_path, {
        "product_id": product_id,
        "version_family": version_family,
        "type": type
      }, function (data) {
        result = data;
        return result;
      });
    }
  }
  $('#vm2 .toggle-mobile').click(function () {
    var element = $(this);
    var vm_item = $(element).parents('.vm-item');
    vm_item.find('.version').toggle();
    vm_item.find('.vm-item-pages').toggle();
    $(element).removeClass('show');
    $(element).removeClass('hidden');
    if (vm_item.find('.version').is(":visible")) {
      $(element).addClass('show');
    } else {
      $(element).addClass('hidden');
    }
  });
  var vues = document.querySelectorAll("#vm2 .vm-item");
  var each = Array.prototype.forEach;
  each.call(vues, function (el, index) {
    new Vue({
      el: el,
      delimiters: ['<{', '}>'],
      // props: ['doc_tag'],
      data: {
        version_family: null,
        doc_tag: null,
        vm_pages: []
      },
      mounted: function mounted() {
        this.doc_tag = this.$el.attributes['data-doc-tag'].value;
        this.version_family = $('#' + this.doc_tag + '_version option:first').val();
        // temporary change default to 6.2 if latest it's 6.4
        // if(this.version_family === "6.4"){
        //     this.version_family = "6.2";
        // }
        this.get_vm_page();
      },
      watch: {
        version_family: function version_family() {
          this.get_vm_page();
        }
      },
      methods: {
        get_vm_page: function get_vm_page() {
          var self = this;
          if (vm_pages_path && product_slug) {
            $.post(vm_pages_path, {
              "product_slug": product_slug,
              "version_family": this.version_family,
              "type": this.doc_tag
            }, function (data) {
              self.vm_pages = data;
            });
          }
        }
      }
    });
  });
});
//# sourceMappingURL=docs.v2.js.map

//# sourceMappingURL=docs.v2.min.js.map
