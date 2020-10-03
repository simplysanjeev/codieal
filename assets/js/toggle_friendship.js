class ToggleFriendship {
    constructor(toggleElement) {
        this.toggler = toggleElement;
        this.toggleFriendship();
    }
    toggleFriendship() {
        $(this.toggler).click(function (event) {
            event.preventDefault();
            let self = this;
            console.log($(self).attr('href'));
            $.ajax({
                    type: 'POST',
                    url: $(self).attr('href'),
                })
                .done(function (data) {
                    console.log(data);
                });

        });
    }
}
