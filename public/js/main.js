const TestCase = require('../../models/testcase');

/*$(document).ready(function(){
    $('.delete-testcase').on('click', function(){
        var id = $(this).data('id');
        var url = '/delete'+ id;
        if(confirm('Вы действительно хотите удалить сценарий?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Удаление сценария..');
                    window.location.href='/startpage/testcases';
                },
                error: function(err){
                    console.log(err);
                }
            });
        };
    });
});*/

$(document).ready(function(){
    $(".delete-testcase").click(function(){
        var id = $(this).data('id');
        var url = '/startpage/testcases/delete'+ id;
        if(confirm('Вы действительно хотите удалить сценарий?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Удаление сценария..');
                    window.location.href='/startpage/testcases';
                },
                error: function(err){
                    console.log(err);
                }
            });
        };
    });

    $(".delete-casestep").click(function(){
        var id = $(this).data('id');
        var idtest = $(this).data('idtest');
        var url = '/startpage/testcases/casestep/delete'+ id;
        if(confirm('Вы действительно хотите удалить сценарий?')){
            $.ajax({
            url: url,
            type: 'DELETE',
            success: function(result){
                console.log('Удаление шага..');
                window.location.reload();
            },
            error: function(err){
                console.log(err);
            }
        });
        };
    });
});