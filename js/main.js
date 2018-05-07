$(function() {
    $('select[name=city_id]').on('change', function() {
        var options = '';
        $.get($('select[name=school_id]').data('url'), { id: $(this).val() },function (response) {
            response.map(function(item){
                options += "<option value='"+item.id+"'>"+item.label+"</option>"
            });

            $('select[name=school_id]').html(options);

            if(  $('select[name=school_id]') .hasClass('selectpicker') ){
                $('select[name=school_id]').selectpicker('refresh')
            }
        })
    });

    $('.href').on('click', function(e) {
        e.preventDefault();
        window.location.href = $(this).data('href');
    });

    // function showPopup(text) {
    //     $('.alert1').css('display','block');
    //     setTimeout(function(){
    //         $('.text').html(text);
    //         $('.alert1 .img').css('display','none');
    //         $('.alert1 .text').css('display','block');
    //     }, 1000);
    // }
    //
    // if(!localStorage.getItem('popup')) {
    //     showPopup();
    // }
    //
    $('.close').click(function() {
        $('.alert1').hide();
    });


    //notification section

    if($("#count_notifications").length) {
        setTimeout(function(){
            $.ajax({
                method:'POST',
                url:$("#count_notifications").data('url'),
                data:{},
                dataType:"JSON"
            }).done(function(res){
                if(res){
                    $("#count_notifications").text(res).show('slow');
                }
            }).fail();
        },1000);
    }


});