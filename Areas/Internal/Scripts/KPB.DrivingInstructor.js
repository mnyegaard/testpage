var KPB = window.KPB || {};

KPB = $.extend(KPB, {
    DrivingInstructor: function (options) {
        var cnt = null;

        this.Init = function (container) {
            cnt = container;

            container.on('click', 'a.show-data-agreement', function () {
                KPB.Dialog.Open({ Action: 'Internal/DrivingInstructor/DataAgreement?id=' + $(this).attr('data-id') });
            });

            container.on('click', 'a.submit', function () {
                var form = $(this).closest('form');

                KPB.Service.Invoke('Internal/DrivingInstructor/Create', form.serialize(), function (response) {
                    if (response.Success) {
                        window.location.href = response.Url;
                    }

                    $.each(response.Views, function (key, value) {
                        value = $.trim(value);
                        container.find('#' + key).html(value);
                    });

                    if (response.Notification) {
                        KPB.Notification.Notify(response.Notification);
                    }
                });
            });

            container.on('click', 'a.submit-renew', function () {
                var form = $(this).closest('form');

                KPB.Service.Invoke('Internal/DrivingInstructor/RenewDataAgreement', form.serialize(), function (response) {
                    if (response.Success) {
                        window.location.href = response.Url;
                    }

                    KPB.Service.HandleViewResponse(container, response);
                });
            });

            container.on('click', 'a.submit-gdpr', function () {
                var form = $(this).closest('form');

                KPB.Service.Invoke('Internal/DrivingInstructor/AcceptGenerelDataProtectionRegulation', form.serialize(), function (response) {
                    if (response.Success) {
                        window.location.href = response.Url;
                    }

                    KPB.Service.HandleViewResponse(container, response);
                });
            });

            container.on('click', 'a.show-gdpr-agreement', function () {
                KPB.Dialog.Open({ Action: 'Internal/DrivingInstructor/ShowGenerelDataProtectionRegulationAgreement' });
            })

            container.on('change', 'select.districts', function () {
                var form = $(this).closest('form');

                KPB.Service.Invoke('Internal/DrivingInstructor/SelectDistrictCreate', form.serialize(), function (response) {
                    KPB.Service.HandleViewResponse(container, response);
                });
            });

            container.on('click', 'a.edit-driving-instructor', function () {
                KPB.Dialog.Open({ Action: 'Internal/DrivingInstructor/Edit?id=' + $(this).attr('data-id'), OK_BUTTON_TEXT: 'Gem' }, null, function () {
                    var self = $(this);
                    var dialog = $(this);

                    dialog.on('click', 'button.btn.btn-default.edit-civil-registration-identifier-search', function () {
                        var form = $(this).closest('form');

                        KPB.Service.Invoke('Internal/DrivingInstructor/EditLookupCivilRegistrationIdentifier', form.serialize(), function (response) {
                            KPB.Service.HandleDialogResponse(self, response);
                        });
                    });
                });
            });

            container.on('click', 'a.edit-driving-instructor-preferences', function () {
                KPB.Dialog.Open({ Action: 'Internal/DrivingInstructor/EditPreferences?drivingInstructorId=' + $(this).attr('data-id'), OK_BUTTON_TEXT: 'Gem' }, null, function () {
                    var dialog = $(this);

                    dialog.on('change', 'select.districts', function () {
                        RefreshEditPreferencesView(dialog);
                    });

                    dialog.on('change', 'select.examtypes', function () {
                        RefreshEditPreferencesView(dialog);
                    });
                });
            });
        };

        // Notefications page (default page driving instructor) 
        this.CitizenNotifications = function (container) {
            container.on('click', 'a.view-release-changes-modal', function () {
                OpenReleaseChangesDialogPage1();
            });

            if (container.find('#HasDrivingInstructorAcceptedReleaseChanges').val() === "False") {
                OpenReleaseChangesDialogPage1();
            };
        };

        function RefreshEditPreferencesView(dialog) {
            var data = dialog.find('form').serialize();

            KPB.Service.Invoke('Internal/DrivingInstructor/EditPreferencesOnChange', data, function (response) {
                $.each(response.Views, function (key, value) {
                    dialog.html(value);
                });
                dialog.find('.chosen-select').chosen({ display_selected_options: false });
            });
        }

        function OpenReleaseChangesDialogPage1() {
            KPB.Dialog.Open({ Action: 'Internal/CitizenEvent/ReleaseChanges' }, null, function () {
                // Page 1
                var dialog = $(this).parent('div.ui-dialog');
                dialog.on('div.ui-dialog-buttonset DIALOG:NEXT_PAGE_EVENT', function () {
                    CloseDialog();
                    OpenReleaseChangesDialogPage2();
                });
            });
        }

        function OpenReleaseChangesDialogPage2() {
            KPB.Dialog.Open({ Action: 'Internal/CitizenEvent/ReleaseChangesNext?pageNumber=2' }, null, function () {
                var dialog = $(this).parent('div.ui-dialog');
                dialog.on('div.ui-dialog-buttonset DIALOG:NEXT_PAGE_EVENT', function () {
                    CloseDialog();
                    OpenReleaseChangesDialogPage3();
                });
                dialog.on('div.ui-dialog-buttonset DIALOG:PREVIOUS_PAGE_EVENT', function () {
                    CloseDialog();
                    OpenReleaseChangesDialogPage1();
                });
            });
        }
        function OpenReleaseChangesDialogPage3() {
            KPB.Dialog.Open({ Action: 'Internal/CitizenEvent/ReleaseChangesNext?pageNumber=3' }, null, function () {
                var dialog = $(this).parent('div.ui-dialog');
                dialog.on('div.ui-dialog-buttonset DIALOG:PREVIOUS_PAGE_EVENT', function () {
                    CloseDialog();
                    OpenReleaseChangesDialogPage2();
                });
            });
        }
    },

    DrivingInstructorDataAgreement: function (options) {
        var cnt = null;

        this.Init = function (container) {
            cnt = container;

            container.on('click', 'a.show-data-agreement', function () {
                KPB.Dialog.Open({ Action: 'Internal/DrivingInstructor/DataAgreement?id=' + $(this).attr('data-id') });
            });
        };
    }
});