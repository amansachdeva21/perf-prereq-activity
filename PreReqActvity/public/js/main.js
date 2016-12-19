var mainObj = mainObj || {};

(function(dataService) {
    "use strict";
    var mode = 'insert';

    function init() {
        fnLoadData();
        fnDefineEvents();
        fnDefineSubmit();
    }

    function fnDefineSubmit () {
        $('form .submit').on('click', function (evt) {
            evt.preventDefault();

            if(!$('form')[0].checkValidity()){
                alert("Fill all fields.");
                return false;
            }

            $('.release-number, .release-name').prop( "disabled", false );
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/insert',
                data: $('form').serialize(),
                success: fnFormSuccess,
                error: fnFormFailure
            })

            return false;

        })
    }

    function fnFormSuccess ( ){
        alert("Form submitted successfully");

        if(mode == 'insert'){
            $('input.form-control').val("");
        }
        $('#load-data').trigger('click');
    }

    function fnFormFailure (error ){
        alert(error)
    }

    function fnLoadData() {

        $.ajax({
            url: "http://localhost:8080/api/nerds",
            context: document.body
        }).done(function(data) {
            console.log(data)

            data = JSON.parse(data);

            var items = [];
            $.each(data.data, function(key, val) {
                var str = "";
                str += "<li class='release-item list-group-item' ";
                str += "id='" + val._id + "' ";
                str += "release-number='" + val.run_number + "' ";
                str += "release-name='" + val.release_name + "' ";
                str += "release-owner='" + val.release_owner + "' ";

                var stdataArr = val.stdata.split(','),
                    datavalueArr = val.datavalue.split(','),
                    len = stdataArr.length;

                for(var i =0 ;i< len; i++ ) {
                    str += "release-stdata--" + stdataArr[i] + "='" + datavalueArr[i] + "' ";
                }

                str += "'>" + val.release_name + " - "  + val.run_number +  "</li>"
                items.push(str);
            });
            var html = items.join("");
            console.log(html);

            $(".release-holder").empty();
            $(html).appendTo(".release-holder");
        });

    }

    function fnDefineEvents() {
        $(document).on('click', '.release-item', function(evt) {
            mode = 'edit';
            $('input.form-control').prop( "disabled", true );
            $('select.form-control').attr("disabled", "disabled" );
            $('.submit').hide();
            $('.release-name').val($(evt.target).attr('release-name'));
            $('.release-number').val($(evt.target).attr('release-number'));
            $('.release-owner').val($(evt.target).attr('release-owner'));
            $('.release-stdata--restore_point').val($(evt.target).attr('release-stdata--restore_point'));
            $('.release-stdata--node_sync').val($(evt.target).attr('release-stdata--node_sync'));
            $('.release-stdata--index_rebuild').val($(evt.target).attr('release-stdata--index_rebuild'));
            $('.release-stdata--stats_gather').val($(evt.target).attr('release-stdata--stats_gather'));
            $('.release-stdata--dep_st').val($(evt.target).attr('release-stdata--dep_st'));
            $('.release-stdata--dmap_que').val($(evt.target).attr('release-stdata--dmap_que'));
            $('.release-stdata--keys_table').val($(evt.target).attr('release-stdata--keys_table'));

            $('.release-id').val($(evt.target).attr('id'));
        })

        $(document).on('click', '#new-item', function(evt) {
            mode = 'insert';
            $('select.form-control').removeAttr( "disabled" );
            $('input.form-control').prop( "disabled", false );
            $('.submit').show();
            $('form input[type="text"]').val('');
        })

        $('#load-data').on('click', function () {
            fnLoadData();
        })
    }

    init();

})(mainObj.dataService = mainObj.dataService || {});
