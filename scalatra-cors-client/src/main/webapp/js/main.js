var viewModel = null;
$(function () {
    viewModel = new ViewModel();
    ko.applyBindings(viewModel);
    viewModel.executeSearch();
});
var ViewModel = (function () {
    function ViewModel() {
        var _this = this;
        this.posts = ko.observableArray();
        this.name = ko.observable();
        this.comment = ko.observable();
        this.sendButtonEnable = ko.computed(function () {
            return _this.name() && _this.name().length > 0 && _this.comment() && _this.comment().length > 0;
        }, this);
        this.searchName = ko.observable();
        this.service = new RestService("http://localhost:8081/posts");
    }
    ViewModel.prototype.sendButtonClickHandler = function (event) {
        var _this = this;
        this.service.addPost(this.name(), this.comment(), function () {
            _this.clearPostInputs();
            _this.executeSearch();
        });
    };
    ViewModel.prototype.searchButtonClickHandler = function (event) {
        this.executeSearch();
    };
    ViewModel.prototype.executeSearch = function () {
        var _this = this;
        this.service.searchByName(this.searchName(), function (posts) {
            return _this.posts(posts);
        });
    };
    ViewModel.prototype.clearPostInputs = function () {
        this.name("");
        this.comment("");
    };
    return ViewModel;
})();
var RestService = (function () {
    function RestService(url) {
        this.url = url;
    }
    RestService.prototype.searchByName = function (name, resultHandler) {
        var sendData = null;
        if(name && name.length > 0) {
            sendData = {
                "name": name
            };
        }
        $.getJSON(this.url, sendData).done(function (data) {
            return resultHandler(data);
        }).fail(function (jqHXR, textStatus, errorThrown) {
            return console.log("getPosts failed. " + textStatus + errorThrown);
        });
    };
    RestService.prototype.addPost = function (name, comment, resultHandler) {
        var sendData = {
            "name": name,
            "comment": comment
        };
        $.ajax({
            type: "POST",
            url: this.url,
            data: JSON.stringify(sendData),
            contentType: "application/json",
            dataType: "text"
        }).done(function (data) {
            return resultHandler();
        }).fail(function (jqHXR, textStatus, errorThrown) {
            return console.log("addPost failed. " + textStatus + errorThrown);
        });
    };
    return RestService;
})();
