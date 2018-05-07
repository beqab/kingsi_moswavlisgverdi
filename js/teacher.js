'use strict';

$(function() {
    var Teacher = {
        ids: [],
        subjects: {
            1: 'math',
            2: 'eng'
        },
        action: '',
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

        getCheckedStudents: function() {
            var id;
            var self = this;
            self.ids = [];
            $('.student').each(function() {
                id = $(this).data('id');
                self.ids.push({
                    id: id,
                    1: ($(this).find('.mathChk')[0].checked) ? 1 : 0,
                    2: ($(this).find('.engChk')[0].checked) ? 1 : 0
                });
            });

            return this.ids;
        },

        showPopup: function(text) {
            $('.alert1').css('display','block');
            setTimeout(function(){
                $('.alert1').find('.text').html(text);
                $('.alert1 .img').css('display','none');
                $('.alert1 .text').css('display','block');
            }, 1000);

            return this;
        },

        formPopup: function () {
            $('.editOrAdd').find('input').val('');
            $('section.edit').addClass('shepop');
            $('.bgtest').addClass('shepop');
        },

        queryParams: function(obj) {
            var str = "?";
            for (var key in obj) {
                if (str != "") {
                    str += "&";
                }
                str += key + "=" + encodeURIComponent(obj[key]);
            }

            return str;
        },

        reload: function() {
            return setTimeout(function(){
                location.reload();
            }, 2000);
        },

        redirect: function(url) {
            return setTimeout(function(){
                window.location.href = url;
            }, 2000);
        }
    };

    var subIds = [];

    $('.selectAll').on('change',function (e) {
        e.preventDefault();
        var subId = $(this).data('subject');
        var subject = (subId > 1) ? 'eng' : 'math';
        var checked = (this.checked) ? true : false;
        subIds.push(subId);
        $('.'+subject+'Chk').each(function() {
            $(this).prop('checked', checked);
        });
    });

    $('#register').on('click', function(e){
        e.preventDefault();

        Teacher.request.data = {
            subjectStudents: Teacher.getCheckedStudents()
        };

        Teacher.request.url = $(this).data('url');
        Teacher.request.type = 'POST';
        Teacher.request.success = function (data) {
            Teacher.showPopup('Jūsų mokinys sėkmingai užregistruotas').reload();
        };

        Teacher.request.error = function (data) {

        };

        Teacher.request.send();
    });

    $('.remove').on('click', function(e){
        e.preventDefault();
        var parent = $(this).parents('.student');
        var data = {
            1: (parent.find('.mathChk')[0].checked) ? 1 : 0,
            2: (parent.find('.engChk')[0].checked) ? 1 : 0,
            id: parent.data('id')
        };


        data[1] = (data[1]) ? data[1]: (parent.find('.registeredStudents').length ? 0: 1 );
        data[2] = (data[2]) ? data[2] :  (parent.find('.registeredStudents').length ? 0: 1 );



        if(!data[1] && !data[2]){


            Teacher.showPopup('Dėmesio! Norėdami pašalinti mokinį, pasirinkite dalyką, kuriame norite panaikinti mokinio dalyvavimo patvirtinimą.').reload();
            return false;
        }

        Teacher.request.data = {
            subjectStudents: data
        };


        Teacher.request.url = $(this).closest('a').data('href');
        Teacher.request.type = 'POST';
        Teacher.request.success = function (data) {
            Teacher.showPopup('Jūsų mokinio paskyra ištrinta').reload();
        };

        Teacher.request.error = function (data) {
            console.log(data);
        };

        Teacher.request.send();
    });

    $('.editSt').on('click',function(e){
        e.preventDefault();

        var parent = $(this).parents('.student');

        $('.class_id_select').show();
        $('.school_id_select').hide();
        $('.city_id_select').hide();
        $('.subject_id_select').hide();

        // var obj = {
        //     math: (parent.find('.mathChk')[0].checked) ? 1 : 0,
        //     eng: (parent.find('.engChk')[0].checked) ? 1 : 0
        // };

        var url = $(this).closest('a').data('url');

        Teacher.formPopup();

        $('.editOrAdd').find('input').val('');

        Teacher.action = 'edit';

        $.get(url,function(response) {
            var student = response.student;
            $('input[name=name]').val(student.name);
            $('input[name=surname]').val(student.surname);
            $('input[name=email]').val(student.email);
            $('input[name=phone]').val(student.phone);
            $('#student_id').val(student.id);
        });

    });


    $('.removeFromEdit').on('click', function (e) {
        e.preventDefault();

        var data = {
            1: $(this).data('math'),
            2: $(this).data('eng'),
            id: $(this).data('student')
        };

        Teacher.request.data = {
            subjectStudents: data
        };

        Teacher.request.url = $(this).data('url');
        Teacher.request.type = 'POST';
        Teacher.request.success = function (data) {
            Teacher.showPopup('Jūsų mokinio paskyra ištrinta').redirect('/teacher/students');
        };

        Teacher.request.error = function (data) {

        };

        Teacher.request.send();

    });

    $('.editOrAdd').on('submit', function(e){
        e.preventDefault();
        var data = $(this).serializeArray();

        if(Teacher.action == 'add') {
            Teacher.request.url = '/teacher/student/add';
            data.push({
                'name': 'school_class_id',
                'value': $('.nav-link.active').data('class')
            });
        }else{
            Teacher.request.url = '/teacher/student/edit/'+$('#student_id').val();
        }

        Teacher.request.data = data;
        Teacher.request.type = 'POST';

        Teacher.request.success = function (data) {
            if(!data.status) {
                Teacher.showPopup("Dalyvis jau užregistruotas");
            }else{
                location.reload();
            }
        };

        Teacher.request.error = function (errors) {
            var errors = jQuery.parseJSON(errors.responseText);

            $("div.errors").html('');
            for(var key in errors){
                for(var i = 0; i < errors[key].length; i++){
                    var error = errors[key][i];
                    $("input[name="+key+"]").next().css("color","#ca0000");
                    $("div.errors").append("<p>"+error+"</p>");
                }
            }
        };

        Teacher.request.send();
    });

    $('.dtp').on('change', function(e) {
        e.preventDefault();

        Teacher.request.url = $(this).data('url');
        Teacher.request.data = {
            date: e.target.value,
            subject: $(this).data('subject')
        };
        Teacher.request.type = 'POST';
        Teacher.request.success = function (data) {

        };

        Teacher.request.error = function (data) {

        };
    });

    $('.addNewSt').on('click', function() {
        Teacher.action = 'add';
        $('.class_id_select').hide();
        $('.school_id_select').hide();
        $('.city_id_select').hide();
        $('.subject_id_select').show();
        Teacher.formPopup();
    });

    $('.bgtest').click(function(){
        $('section.edit').removeClass('shepop');
        $(this).removeClass('shepop');
    });

    $("#before_pay").on('click',function(e){
        e.preventDefault();
        var checkedStudents = Teacher.getCheckedStudents();


        $.ajax({
            type:"POST",
            url:$("#pay_for_students").data("url"),
            data:{"data":checkedStudents},
            dataType:"JSON"
        }).done(function (res) {

            if(res.success){
                $("#pay_for_students").submit();
            }else{
                alert('Please Select Student')
            }

        }).fail();




    });
});