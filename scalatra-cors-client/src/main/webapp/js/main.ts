/// <reference path="typings/jquery.d.ts" />
/// <reference path="typings/knockout.d.ts" />

var viewModel: ViewModel = null

$(() => {
    viewModel = new ViewModel()
    ko.applyBindings(viewModel)
    viewModel.executeSearch()
})

class ViewModel {

    posts: KnockoutObservableArray;
    name: KnockoutObservableString;
    comment: KnockoutObservableString;
    sendButtonEnable: KnockoutComputed;
    searchName: KnockoutObservableString;
    service: RestService;

    constructor() {
        this.posts = ko.observableArray()
        this.name = ko.observable()
        this.comment = ko.observable()
        this.sendButtonEnable = ko.computed(() => {
            return this.name() && this.name().length > 0 
                && this.comment() && this.comment().length > 0
        }, this)
        this.searchName = ko.observable()
        this.service = new RestService("http://localhost:8081/posts")
    }

    sendButtonClickHandler(event) {
        this.service.addPost(this.name(), this.comment(), () => {
            this.clearPostInputs()
            this.executeSearch()
        })
    }

    searchButtonClickHandler(event) {
        this.executeSearch()
    }

    executeSearch() {
        this.service.searchByName(this.searchName(), (posts) =>
            this.posts(posts)
        )
    }

    clearPostInputs() {
        this.name("")
        this.comment("")
    }
}

class RestService {

    url: string;

    constructor(url) {
        this.url = url
    }

    searchByName(name: string, resultHandler: (posts: any[]) => void) {
        var sendData = null
        if (name && name.length > 0) {
            sendData = { "name": name }
        }
        $.getJSON(this.url, sendData)
            .done((data) => resultHandler(data))
            .fail((jqHXR, textStatus, errorThrown) => console.log("getPosts failed. " + textStatus + errorThrown))
    }

    addPost(name: string, comment: string, resultHandler: () => void) {
        var sendData = { "name" : name , "comment" : comment }
        $.ajax({
            type: "POST",
            url: this.url, 
            data: JSON.stringify(sendData), 
            contentType: "application/json",
            dataType: "text"
        })
        .done((data) => resultHandler())
        .fail((jqHXR, textStatus, errorThrown) => console.log("addPost failed. " + textStatus + errorThrown))
    }
}