const customBannerWidget = {
    render: function (options) {
        $("#free_promotional_banner").remove();
        $("#promotional_banner").remove();
        const userData = options.results._rawResults[0].userData;
        if (userData) {
            if (userData[0].free_shipping_banner) {
                let banner = $('<img data-image="free-shipping" class="img-banner" style="width:200px;">').attr('src', `./assets/img/${userData[0].free_shipping_banner}`);
                $('#right-column').prepend(`<div id="free_promotional_banner"></div>`)
                $("#free_promotional_banner").append(banner);

            } else if ($('#promotional_banner').length === 0) {
                let samsungBanner = $('<img data-image="samsung" class="img-banner" >').attr('src', `./assets/img/${userData[0].samsung_banner}`);
                let appleBanner = $('<img data-image="apple" class="img-banner" >').attr('src', `./assets/img/${userData[0].apple_banner}`);
                $('.aa-dropdown-menu').prepend(`<div id="promotional_banner"></div>`)
                $("#promotional_banner").append(samsungBanner).append(appleBanner);
            }

            // Click handlers for images
            $(".img-banner").click((e) => {
                const type = $(e.target).data().image;
                switch (type) {
                    case 'samsung':
                        options.helper.setQuery('Samsung Galaxy Note 4 4G Cell Phone').search()
                        $('#aa-search-input').val('Samsung Galaxy Note 4');
                        break;
                    case 'apple':
                        options.helper.setQuery('iPhone 6 128GB').search()
                        $('#aa-search-input').val('iPhone 6 128GB');
                        break;
                    default:
                        break;
                }
            });
        }
    }
}