'use strict';
// generate url and Load Url
// url函数 读取默认URL 同时获取url链接中的 来获取cname 存储在storage中

class Url {
  constructor() {
    // Initializes by reading the URL and loading inside storage
    this.init = function () {
      that.storage = {};
      // 获取输入框中默认的原生url

      var url = window.location.search;
      console.log("windows.search url: "+url);
      
      var hash = url.substr(url.indexOf('?') + 1);


      if (hash === "")
        hash = 'c=hermione';
      hash.split('&').forEach(function (hashElement) {
        if (hashElement.indexOf('=') > 0) {
          var keyPair = hashElement.split('=');
          if (keyPair[0] && keyPair[1] && keyPair[0] !== '')
            that.storage[keyPair[0]] = keyPair[1];
      
          //window.print(that.keyPair);
          //window.print(that.keyPair);
          //真打印啊。。
        }
      });
      return that.storage;
    };
    var that = this;
    this.init();
    return this;
  }
}
//通过url获取到所有的衣服设置 并分类存储 添加衣柜的add remove方法 添加update方法 
class UrlStorage {
  constructor(defaults, characterName) {
    // Initializes by reading the URL and loading inside storage
    this.init = function (characterName) {
      that.characterName = characterName;

      that.storage = {};
      var url = window.location.hash;
      var hash = url.substr(url.indexOf('#') + 1);
      console.log("defaults数组中的配置:" + defaults['hermione']);
      console.log("name:" + characterName);
      console.log("url:" + url);
      console.log("hash1:" + hash);

      // Default setting:
      if (hash === "") {
        hash = defaults[characterName];
      }
      console.log("hash2 取到的值:" + hash);
      if (hash !== undefined) {
        hash.split(';').forEach(function (hashElement) {
          if (hashElement.indexOf(':') > 0) {
            var keyPair = hashElement.split(':');
            if (keyPair[0] && keyPair[1] && keyPair[0] !== '')
              that.storage[keyPair[0]] = keyPair[1];
            console.log("便利hash2: " + keyPair[0] + ": " + keyPair[1]);
          }
        });
      }
      return that.storage;
    };
    // Updates the URL based on what's stored
    this.generateUrlHash = function () {
      var generatedUrl = '#';
      for (var key in that.storage) {
        if (that.storage[key] !== '-') {
          generatedUrl = generatedUrl + key + ':' + that.storage[key] + ';';
        }
      }
      return generatedUrl;
    };
    this.update = function () {
      if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
      }
      return $('#generated-url').prop('value', window.location.origin + window.location.pathname + window.location.search + that.generateUrlHash());
    };
    // Adds an element
    this.add = function (key, value) {
      that.storage[key] = value;
      that.update();
      return value;
    };
    // Removes an element
    this.remove = function (key) {
      delete that.storage[key];
      that.update();
      return key;
    };
    // Checks if element is present
    this.isPresent = function (key, value) {
      return that.storage[key] === value;
    };
    var that = this;
    this.init(characterName);
    return this;
  }
}

/* Singleton object search implement */
var Search = {
  index: lunr(function () {
    this.ref('id');
    this.field('title', {
      boost: 10
    });
    this.field('category');
    this.field('file');
    this.field('keywords', {
      boost: 4
    });
  }),
  fieldEvent: function () {
    var searchTerms = $.trim($(this).val());
    if (searchTerms === '') {
      $('#wardrobe .miniature').show();
    } else {
      $('#wardrobe .miniature').hide();
      Search.index.search(searchTerms).forEach(
        function (item) {
          $("#wardrobe .miniature[data-category='" + item.ref[0] + "'][data-file='" + item.ref[1] + "']").show();
        }
      );
    }
  }
};
// BodyshopView layer  manager
class BodyshopView {
  constructor(bodyshop, characterName, storage) {
    this.init = function (bodyshop, characterName, storage) {
      that.characterName = characterName;
      that.storage = storage;
      //console.log("bodyview: " + bodyshop['hermione']['arms_left']);
      var n = 0;
      for (var key in bodyshop[that.characterName]) {
        console.log("bodyview key " + n++ + " :" + bodyshop[that.characterName][key]);
        that.loadCategory(bodyshop[that.characterName][key], key);
      }
    };
    this.dressItem = function (el) {
      var $this = $(this);
      var category = $this.prop('name');
      var name = $this.prop('value');
      if (name === '-') {
        $('#' + category).css({
          backgroundImage: "none"
        });
      } else {
        $('#' + category).css({
          backgroundImage: "url(" + that.itemSrc(category, name) + ")"
        });
      }
      that.storage.add(category, name);
    };
    this.itemSrc = function (category, name) {
      return that.characterName + '/body/' + category + '/' + name + '.png';
    };
    this.loadCategory = function (contents, folder) {
      if (contents.length === 0)
        return;
      var containerEl = $('<div></div>', {
        'class': 'bodyshop-item'
      }).appendTo('#bodyshop');
      $('<label>' + folder + ':</label>', {
        'for': folder
      }).appendTo(containerEl);

/*
      var appid = '20191130000361835';
      var key = 'voLU2kk83J0M2co9PLge';
      var salt = (new Date).getTime();
      var query = folder;
      var result;
      // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
      var from = 'en';
      var to = 'zh';
      var str1 = appid + query + salt +key;
      var sign = MD5(str1);
      $.ajax({
          url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
          type: 'get',
          dataType: 'jsonp',
          data: {
              q: query,
              appid: appid,
              salt: salt,
              from: from,
              to: to,
              sign: sign
          },
          success: function (data) {
              console.log(data);
              result = data.to;
          } 
      });
      */

      var selectEl = $('<select name="' + folder + '">' + folder + '</select>').
      on('change', that.dressItem).
      appendTo(containerEl);
      selectEl.append($('<option>-</option>', {
        'value': '-'
      }));
      for (var item of contents) {
        var optionEl = $('<option>' + item + '</option>', {
          'value': folder + '/' + item
        });
        if (that.storage.isPresent(folder, item))
          optionEl.prop('selected', true);
        selectEl.append(optionEl);
      }
      selectEl.trigger('change');
      return containerEl;
    };
    var that = this;
    this.init(bodyshop, characterName, storage);
    return this;
  }
}
// Wardrobe view manager
class WardrobeView {
  constructor(wardrobe, characterName, storage) {
    this.init = function (wardrobe, characterName, storage) {
      that.characterName = characterName;
      that.storage = storage;
      var n = 0;
      for (var key in wardrobe[that.characterName]) {
        var n;
        that.loadCategory(wardrobe[that.characterName][key], key);
        console.log("key " + n++ + " :" + key);


      }
      $('.remove-all-button').on('click', function () {
        $('.remove-button').trigger('click');
      });
    };
    this.dressItem = function (el, category, name) {
      if ($(this).hasClass('selected')) {
        // Clicking an already selected item undresses it
        $('#' + category).css({
          backgroundImage: ''
        });
        that.storage.remove(category);
        // Remove selection mark
        $(this).removeClass('selected');
        $('#' + category + '-selection .remove-button').hide();
      } else {
        // Dresses the item
        $('#' + category).css({
          backgroundImage: "url(" + that.itemSrc(category, name) + ")"
        });
        that.storage.add(category, name);
        // Check for body overwrite
        var splitOptions = name.split("/");
        if (splitOptions.length > 1) {
          var splitBodyOptions = splitOptions[0].split('^');
          for (var splitBodyOption of splitBodyOptions) {
            var splitBodyOptionExtracted = splitBodyOption.split(".");
            $("select[name='" + splitBodyOptionExtracted[0] + "']").prop('value', splitBodyOptionExtracted[1]).trigger('change');
          }
        }
        // Mark it as selected and present Remove button
        $('#' + category + '-selection .selected').removeClass('selected');
        $(this).addClass('selected');
        $('#' + category + '-selection .remove-button').show();
      }
    };
    this.itemSrc = function (category, name) {
      return that.characterName + '/clothes/' + category + '/' + name + '.png';
    };
    this.loadCategory = function (contents, folder) {

      if (contents.length === 0)
        return;
      var wardrobeEl = $('#wardrobe');
      var categoryTitleEl = $("<h3>" + folder + " </h3>");
      var categoryDiv = $('<div></div>', {
        'id': folder + '-selection'
      });
      wardrobeEl.append(categoryDiv);
      categoryDiv.append(categoryTitleEl);
      categoryTitleEl.append($("<button class='remove-button'>脱掉</button>").on('click', function () {
        $('#' + folder).css({
          backgroundImage: ''
        });
        $(this).hide();
        that.storage.remove(folder);
        $('#' + folder + '-selection .selected').removeClass('selected');
      }).hide());



      for (var item of contents) {


        var title = item.replace(/^([a-z0-9-_.^]+\/)/, "").replace(/_/g, " ");
        var divEl = $("<div></div>", {
          'class': 'miniature',
          title: title,
          'data-category': folder,
          'data-file': item
        }).
        on('dress', that.dressItem).
        on('click', function () {
          var el = $(this);
          el.trigger('dress', [el.data('category'), el.data('file')]);
        });
        $("<img></img>", {
          src: that.itemSrc(folder, item),
          title: title
        }).appendTo(divEl);
        // Check for body overwrite
        var splitOptions = item.split("/");
        if (splitOptions.length > 1) {
          var overwrites = $("<div></div>", {
            class: "overwrites"
          });
          var splitBodyOptions = splitOptions[0].split('^');
          for (var splitBodyOption of splitBodyOptions) {
            var splitBodyOptionExtracted = splitBodyOption.split(".");
            $("<span>" + splitBodyOptionExtracted[0] + "</span>").appendTo(overwrites);
          }
          overwrites.appendTo(divEl);
        }
        if (that.storage.isPresent(folder, item))
          divEl.trigger('dress', [folder, item]);
        Search.index.add({
          id: [folder, item],
          category: folder,
          file: item,
          title: title
        });
        categoryDiv.append(divEl);
      }
    };
    var that = this;
    this.init(wardrobe, characterName, storage);
    return this;
  }
}
// Trainer Web Library
var TrainersApp = function () {
  //默认设置 传入默认衣物defaults 获取默认characterName
  var url = new Url();

  //获取衣服配置表 添加各种函数实现与功能
  var urlStorage = new UrlStorage(Defaults, url.storage.c);

  //传入bodyshop配置表 传入characterName，传入urlStorage函数实例
  var bodyshopView = new BodyshopView(Bodyshop, url.storage.c, urlStorage);

  //传入wardrobe配置表 传入characterName，传入urlStorage实例
  var wardrobeView = new WardrobeView(Wardrobe, url.storage.c, urlStorage);

  $("#generated-url").
  on('focus', function () {
    this.select();
  });

  $("#search").
  on('keyup', Search.fieldEvent).
  on('change', Search.fieldEvent);
};