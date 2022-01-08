 //slugify
 function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}



var body = ace.edit("body");
var responseContainer = ace.edit("response");

$(document).ready(function() {

    build_url();

    body.getSession().setUseWorker(false);
    body.getSession().setMode("ace/mode/json");
    body.setTheme("ace/theme/solarized_dark");



    responseContainer.getSession().setUseWorker(false);
    responseContainer.getSession().setMode("ace/mode/json");
    responseContainer.setTheme("ace/theme/solarized_dark");
    responseContainer.setReadOnly(true);

    function http() {
        return axios.create({
            baseURL: build_url(false),
            headers: {
                'X-Api-Key': $('#key').val()
            },
        });
    }

    function build_url(set_form=true) {
        let prefix = location.href;
        let url = prefix + 'app';
        let namespace = $('#namespace').val();
        let query = $('#query').val();
        if (namespace) {
            url += '/' + slugify(namespace);
        }

        if (query) {
            url += '?' + query;
        }


        if(set_form) {
            $('#address').val(url)
        } else {
            return url;
        }
    }

    function play() {
        let method = $('#method').val();

        let url = build_url();

        let data = {};

        if (method == 'GET') {
            data = {};
        }

        if (method == 'POST' || method == 'PUT') {
            data = JSON.parse(body.getValue());
        }

        let setStatus = (req) => {
            $('#status-code').text(req.status);
            $('#status-message').text(req.statusText);
        }

        http().request({
            url: url,
            method: method,
            data: data
        }).then(function(response) {
            console.log(response)
            setStatus(response.request);
            responseContainer.setValue(JSON.stringify(response.data, null, 4), 1)
        }).catch(function(error) {
            setStatus(error.response.request);
            console.log(error)
        });
    }

    $('#exec').on('click', play)

    $('#namespace, #query').on('keyup', function() {
        build_url();
    });

    $('#body').parent().hide();

    $('#method').change(function() {
        if ($(this).val() == 'GET' || $(this).val() == 'DELETE') {
            $('#body').parent().hide();
            $('#query').parent().show();
        } else if($(this).val() == "PUT") {
            $('#body').parent().show();
            $('#query').parent().show();
        } else {
            $('#query').parent().hide();
            $('#body').parent().show();
            $('#body').val('{}');
        }
    });


});