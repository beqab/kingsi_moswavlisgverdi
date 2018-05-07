'use strict'

$(function() {
    var Register = {

        step: 1,

        selectStep: function(step) {

            var step = (step) ? step : this.step;

            if(this.step == 1) return false;

            $('.stepBtn').removeClass('active');

            if(step == 1){
                $('.flset .steps.fadebox').css('z-index', -1);
                $('.stepBtn[data-step="1"]').addClass('active');
            }else{
                $('.flset .steps.fadebox').css('z-index', 1);
                $('.stepBtn[data-step="2"]').addClass('active');
            }

            return this;
        },

        request: {
            url: null,
            data:{},
            type:null,
            success: null,
            error: null,
            send: function () {
                return $.ajax({
                    url: this.url,
                    type: this.type,
                    data: this.data,
                    success: this.success,
                    error: this.error
                });
            }
        },

        errors: {
            div: null,
            data: [],
            template: null,
            draw: function() {
                $("div.errors div").remove();
                $(".steps label").css("color","#000");
                for(var key in this.data){
                    for(var i = 0; i < this.data[key].length; i++){
                        var error = this.data[key][i];
                        $("input[name="+key+"]").next().css("color","#ca0000");
                        $("div.errors").append("<div>"+error+"</div>");
                    }
                }
            }
        },

        showPopup: function(text) {
            $('.alert1').css('display','block');
            setTimeout(function(){
                $('.text').html(text);
                $('.alert1 .img').css('display','none');
                $('.alert1 .text').css('display','block');
            }, 1000);

            return this;
        }
    };

    $('.stepBtn').on('click', function() {
        var step = $(this).data('step');
        Register.selectStep(step);
    });

    $('#signupForm').on('submit', function(e) {
        e.preventDefault();
        // $(this).find('label').css("color","#ca0000");
        $('.errors').html('');
        Register.request.url  = $(this).attr('action');
        Register.request.type = $(this).attr('method');
        Register.request.data = $(this).serializeArray();
        Register.request.data.push({
            name: 'step',
            value: Register.step
        });

        Register.request.success = function (response) {
            if(response.status && response.step == 1){
                Register.step = 2;
                Register.selectStep();
            }else if(response.status && response.step == 2) {
                Register.showPopup('Registracija sėkminga');
                setTimeout(function(){
                    window.location.href = '/prisijungti';
                }, 2000);
            }
        };

        Register.request.error = function (errors) {
            Register.errors.data = jQuery.parseJSON(errors.responseText);
            Register.errors.div = $('.steps.fadebox .erroralert');
            Register.errors.draw(errors);
        };

        Register.request.send();
    });
});






