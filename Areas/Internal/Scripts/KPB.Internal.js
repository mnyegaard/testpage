var KPB = window.KPB || {};

KPB = $.extend(KPB, {
    Internal: function (options) {
        var cnt = null;

        this.Init = function (container) {
            cnt = container;

            container.on('click', 'a.quick-search', function () {
                var input = $(this).closest('div').find('input[type="text"]');
                Search(input.val(), input.attr('data-url'));
            });

            container.on('keypress', 'input[type="text"].quick-search', function (e) {
                if (e.which == 13) {
                    var input = $(this);
                    Search(input.val(), input.attr('data-url'));
                }
            });

            container.on('click', 'a.create-application', function () {
                var self = $(this);
                var data = { Id: self.attr('data-id'), Url: self.attr('data-url') };

                KPB.Service.Invoke('Internal/Home/CreateApplication', data, function (response) {
                    KPB.Service.HandleUrlResponse(response);
                });
            });
        };

        var Search = function (civilRegistrationIdentifier, redirectUrl) {
            KPB.Service.Invoke('Internal/Citizen/QuickSearch', { CivilRegistrationIdentifier: civilRegistrationIdentifier }, function (response) {
                if (response.Success) {
                    KPB.Service.HandleUrlResponse(response);
                }
                else {
                    if (response.Notification) {
                        KPB.Notification.Notify(response.Notification);
                    }
                    else {
                        KPB.Dialog.Open({
                            Action: 'Internal/Application/CreateApplication?CivilRegistrationIdentifier=' + civilRegistrationIdentifier + '&redirecturl=' + redirectUrl,
                            OK_BUTTON_TEXT: 'Opret',
                            Success: function (response) {
                                KPB.Service.HandleUrlResponse(response);
                            }
                        });
                    }
                }
            });
        }
    }
});