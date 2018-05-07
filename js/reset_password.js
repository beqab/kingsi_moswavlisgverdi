$(function(){
    $("form#reset_password").on("submit",function(e){
        e.preventDefault();
        $("#reset_paswword_message").hide();
        $("#reset_paswword_message label").remove();

        swal({
            html:true,
            title: "",
            text: '<i class="fa fa-refresh fa-spin fa-5x fa-fw"></i>',
            showConfirmButton: false,
            showCancelButton: false
        });

        $.ajax({
            type:"POST",
            url:$(this).attr('action'),
            data:$(this).serialize(),
            dtaType:"JSON"
        }).done(function (res) {
            if(res.errors){
                $.each(res.errors,function(i,m){
                    $("#reset_paswword_message").append("<label>"+m+"</label>").show();
                });
            }
            if(res.updated){
                // $("#reset_paswword_message").removeClass("alert-danger").addClass('alert-success').append("<label>"+res.text+"</label>").show();
                swal({
                    html:true,
                    title: "",
                    text: res.text,
                    confirmButtonText: "Uždaryti"
                });
                setTimeout(function(){window.location = '/prisijungti'},4000);

            }
        }).fail(function (res) {

        });

    });
})