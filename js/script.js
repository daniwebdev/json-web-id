 //slugify
 function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

var statusCode = {
    "100": "Continue",
    "101": "Switching Protocols",
    "200": "OK",
    "201": "Created",
    "202": "Accepted",
    "203": "Non-Authoritative Information",
    "204": "No Content",
    "205": "Reset Content",
    "206": "Partial Content",
    "300": "Multiple Choices",
    "301": "Moved Permanently",
    "302": "Moved Temporarily",
    "303": "See Other",
    "304": "Not Modified",
    "305": "Use Proxy",
    "400": "Bad Request",
    "401": "Unauthorized",
    "402": "Payment Required",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "406": "Not Acceptable",
    "407": "Proxy Authentication Required",
    "408": "Request Time-out",
    "409": "Conflict",
    "410": "Gone",
    "411": "Length Required",
    "412": "Precondition Failed",
    "413": "Request Entity Too Large",
    "414": "Request-URI Too Large",
    "415": "Unsupported Media Type",
    "500": "Internal Server Error",
    "501": "Not Implemented",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Time-out",
    "505": "HTTP Version not supported",
}

var body = ace.edit("body");
var responseContainer = ace.edit("response");

document.querySelectorAll('.response-example').forEach(el => {
    let data = $(el).attr('data-json');

    $(el).html(JSON.stringify(JSON.parse(data), null, 4));

    let editor = ace.edit(el);
    editor.getSession().setUseWorker(false);
    editor.getSession().setMode("ace/mode/json");
    editor.setTheme("ace/theme/solarized_dark");
    editor.setReadOnly(true);
    editor.renderer.$fontMetrics.el.style.display = "block"
    editor.renderer.setShowGutter(false);
});


const json_sample = {
    product: {
        name: "Product 1",
        price: 100,
        description: "Product 1 description",
        image: "https://via.placeholder.com/150",
        category: "category 1",
        subcategory: "subcategory 1",
        tags: ["tag 1", "tag 2", "tag 3"]
    },
    user: {
        name: "User 1",
        email: "user@mail.com",
        password: "123456",
        phone: "123456789",
        address: "Address 1",
        city: "City 1",
        state: "State 1",
        country: "Country 1",
        zip: "123456",
        role: "admin",
        status: "active"
    },
    movie: {
        title: "Movie 1",
        description: "Movie 1 description",
        image: "https://via.placeholder.com/150",
        category: "category 1",
        subcategory: "subcategory 1",
        tags: ["tag 1", "tag 2", "tag 3"]
    },
}

function parseCURL(params) {
    let curl_command = CurlGenerator(params);

    $('#curl').text(curl_command);
}

$(function() {
   

    build_url();
    set_path('');

    body.getSession().setUseWorker(false);
    body.getSession().setMode("ace/mode/json");
    body.setTheme("ace/theme/solarized_dark");


    responseContainer.getSession().setUseWorker(false);
    responseContainer.getSession().setMode("ace/mode/json");
    responseContainer.setTheme("ace/theme/solarized_dark");
    responseContainer.setReadOnly(true);


    var httpInstance = null;

    function http() {

        if(httpInstance == null) {
            httpInstance = axios.create({
                baseURL: build_url(false),
                headers: {
                    'X-Api-Key': $('#key').val()
                },
            });


            httpInstance.interceptors.request.use(function(config) {
                try {
                    console.log(config.headers)
                    config.headers['X-Api-Key'] =  $('#key').val();
                    
                    let headers = {};

                    for(let h in config.headers) {
                        let value = config.headers[h];

                        if(typeof value == 'string') {
                            headers[h] = value;
                        }
                    }


                    console.log(headers);

                    headers['Content-Type'] = "application/json";

                    parseCURL({
                        url: $('#address').val(),
                        method: config.method.toUpperCase(),
                        headers: headers,
                        body: config.data
                    })
        
                } catch (error) {
                    console.log(error)                
                }
                return config;
            })
        }


        return httpInstance;
    }

    function set_path(path='') {
        let prefix  = BASE_URL;
        let namespace = $('#namespace').val();
        let url     = prefix + 'app' + path;

        $('#address').val(url)
    }

    function build_url(set_form=true) {
        
        let prefix    = BASE_URL;
        let url       = prefix + 'app';
        let namespace = $('#namespace').val();
        let query     = $('#query').val();
        
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
        let is_disabled = $('#exec').prop('disabled');
        
        if(is_disabled) {
            return;
        } else {
            $('#exec').prop('disabled', true);
        }

        $('#exec').html('<i class="fa fa-spinner fa-spin"></i>');

        let method = $('#method').val();

        let url = $('#address').val();
        // let url = build_url();

        let data = {};

        if (method == 'GET') {
            data = {};
        }

        if (method == 'POST' || method == 'PUT') {
            try {
                data = JSON.parse(body.getValue());
            } catch (e) {

                $('#exec').html('<i class="fa fa-play"></i>');
                $('#exec').prop('disabled', false);
                
                alert('Invalid JSON Data');

                return;
            }
        }

        let setStatus = (req) => {
            $('#status-code').text(req.status);
            $('#status-message').text(statusCode[req.status]);
        }

        http().request({
            url: url,
            method: method,
            data: data
        }).then(function(response) {
            console.log(response)
            setStatus(response.request);
            responseContainer.setValue(JSON.stringify(response.data, null, 4), 1);
            
            $('#exec').prop('disabled', false);
            $('#exec').html('<i class="fa fa-play"></i>');
        }).catch(function(error) {
            setStatus(error.response.request);
            console.log(error)
            responseContainer.setValue(JSON.stringify(error.response.data, null, 4), 1);
            $('#exec').prop('disabled', false);
            $('#exec').html('<i class="fa fa-play"></i>');
        });
    }

    $('#exec').on('click', play)

    $('#namespace, #query').on('keyup', function() {
        build_url();
    });

    $('#body').parent().hide();

    $('#method').on('change ',function() {

        if ($(this).val() == 'GET' || $(this).val() == 'DELETE') {
            $('#body').parent().hide();
            $('#query').parent().show().val('');
            $('#body').val('{}');
        } else if($(this).val() == "PUT") {
            $('#body').parent().show().val('{}');
            $('#query').parent().show()
            $('#query').val('');
            $('#body').val('{}');
        } else {
            $('#query').parent().hide();
            $('#body').parent().show().val('');
            $('#body').val('{}');
        }

    });

    $('.json-sample').on('click', function() {
        let key = $(this).attr('data-key');
        body.setValue(JSON.stringify(json_sample[key], null, 4), 1);

    });

    $('.reset-body').on('click', function() {
        body.setValue('{}', 1);
    });


    // Change Method
    requestMethod = 'GET';
    activeMethod = '';

    document.querySelectorAll('.method-item').forEach(el => {
        el.addEventListener('click', function(e) {
            var active = document.querySelector('.method-item.bg-orange-600');
            var method = this.getAttribute('data-method');
            var requestMethod = 'GET';

            if(this.classList.contains('bg-orange-600')) {
                // if is active don't do anythings
                return false;
            }

            // alert(method)
            this.classList.toggle('bg-orange-600')
            this.classList.toggle('text-white')
            
            this.classList.toggle('bg-gray-200')

            active.classList.toggle('bg-orange-600')
            active.classList.toggle('text-white')
            active.classList.toggle('bg-gray-200')


            // reset path
            set_path('');

            switch (method) {
                case 'get-data':
                    $('#body').parent().hide();
                    $('#query').parent().show().val('');
                    $('#body').val('{}');
                    
                    requestMethod = 'GET';
                    build_url();
                    break;
                case 'update-data':
                    requestMethod = 'PUT';

                    $('#body').parent().show().val('{}');
                    $('#query').parent().show()
                    $('#query').val('');
                    $('#body').val('{}');
                    build_url();

                    break;
                case 'create-data':
                    requestMethod = 'POST';
                    
                    $('#query').parent().hide();
                    $('#body').parent().show().val('');
                    $('#body').val('{}');
                    $('#sample-button-container').show();
                    build_url();

                    break;
                case 'delete-data':
                    requestMethod = 'DELETE'

                    $('#body').parent().hide();
                    $('#query').parent().show().val('');
                    $('#body').val('{}');
                    build_url();

                    break;
                case 'auth-register': {
                    if(activeMethod == method) {
                        break;
                    }

                    requestMethod = 'POST';

                    set_path('/register');

                    $('#query').parent().hide();
                    $('#body').parent().show().val('');
                    $('#body').val('{}');

                    $('#sample-button-container').hide();

                    body.setValue(JSON.stringify({
                        "email": "example@mail.com",
                        "password": "secret"
                    }, null, 4), 1);

                    break;
                }
                case 'auth-login': {
                    if(activeMethod == method) {
                        break;
                    }

                    requestMethod = 'POST';

                    set_path('/login');

                    $('#query').parent().hide();
                    $('#body').parent().show().val('');
                    $('#body').val('{}');

                    $('#sample-button-container').hide();

                    body.setValue(JSON.stringify({
                        "email": "example@mail.com",
                        "password": "secret"
                    }, null, 4), 1);
                    break;
                }
                default:
                    break;
            }
            activeMethod = method;

            $('#method').val(requestMethod)

            // alert(requestMethod);

            // if ($(this).val() == 'GET' || $(this).val() == 'DELETE') {
            //     $('#body').parent().hide();
            //     $('#query').parent().show().val('');
            //     $('#body').val('{}');
            // } else if($(this).val() == "PUT") {
            //     $('#body').parent().show().val('{}');
            //     $('#query').parent().show()
            //     $('#query').val('');
            //     $('#body').val('{}');
            // } else {
            //     $('#query').parent().hide();
            //     $('#body').parent().show().val('');
            //     $('#body').val('{}');
            // }
        })
    })

});