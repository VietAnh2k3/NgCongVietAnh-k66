

function validator(options) {
    //lấy thẻ form
    var formElement = document.querySelector(options.form)
    var selectorRules = {}


    //xử lý khi submit form
    formElement.onsubmit = function(event){
        event.preventDefault();
        
        var isFormValid = true;

        //lặp qua từng rule và validate

        options.rules.forEach(function (rule) {
            //lấy input từng thẻ
            var inputElement = formElement.querySelector(rule.selector);
            var isValid = validate(inputElement, rule);

            if (isValid) {
                isFormValid = false;
            }
            
        });


        //put API

        //CASE: submit voi javascript
        if(isFormValid) {
            if(typeof options.onsubmit === "function"){

                var inputForm = formElement.querySelectorAll('[name]');
                var valueFormInput = Array.from(inputForm).reduce(function(value,input){
                    switch(input.type){
                        case 'radio':
                            if(input.matches(':checked')){
                                value[input.name] = input.value;
                            }
                            break;
                        

                        case 'checkbox':
                            if(!input.matches(':checked')) {
                                value[input.name] = [];
                                return value;
                            }
                            if(!Array.isArray(value[input.name])){
                                value[input.name] = [];
                                
                            }
                            value[input.name].push(input.value);
                            break;

                        case 'file':
                            value[input.name] = input.files;
                            break;
                        default:
                        value[input.name] = input.value;
                    }
                    return  value;
                },{});

                

                options.onsubmit({valueFormInput})
            }
            //submit voi hanh vi mac dinh
            // else{
            //     formElement.submit();
            // }
        }
       
    }

    

    //cách 1 : lấy thằng cửa element có selector 
    function getParent(element, selector){
        while(element.parentElement){
            
            if(element.parentElement.matches(selector))
            {
                return element.parentElement;
            }
            
            element = element.parentElement;
        }
    }


    //cách 2 : lấy thằng cửa element có selector 
    // function getParent(element, selector){
    //     console.log(element);
    //     const parent = element.parentElement;
        
    //     while (parent.className == selector) {
    //         parent = parent.parentElement;
            
    //     }
    //     return parent;
    // }


    
    //kiểm tra coi điềm giá trị chưa (ngoài ra éo có tác dụng gì)
    function validate (inputElement,rule){
        //formInput: lấy thẻ input
        //rule

        //lấy thẻ span cho việc hiển thị thông báo lỗi
        var messageElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelect);
        
        //lấy tất cả các rule
        var rules = selectorRules[rule.selector];
        
        //thông báo lỗi
        var errorMess;

        //lặp qua các rule
        for(let i = 0; i < rules.length; i++) {

            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMess = rules[i](formElement.querySelector(rule.selector + ':checked'));
                    break;
                    
                default:
                    errorMess = rules[i](inputElement.value);
                
            }

            if(errorMess) break;
            //khi có lỗi thì lấy
        }
            
        //hiện thị thông báo lỗi
        if(errorMess){
            //xử lý khi có thông báo lỗi
            messageElement.innerText = errorMess;
            getParent(inputElement,options.formGroupSelector).classList.add('invalid');
        }else{
            // xử lý khi undefined
            messageElement.innerText = '';
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
        }


        return !!errorMess;
    }
    

    if (formElement) {
        options.rules.forEach(function (rule) {
            //lưu các test
            

            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElements = document.querySelectorAll(rule.selector);

            
            
            for(var inputElement of Array.from(inputElements)){
                if (inputElement) {

                    //xử lý khi blur ra khỏi vùng input
                    inputElement.onblur = function () {
                        validate (inputElement,rule);
                    }
    
    
                    //xử lý khi đang nhập input
                    inputElement.oninput = function () {
                        var messageElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelect)
                        messageElement.innerText = '';
                        getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
                        
                    };
                }
            }
        })
    }

    
}

//định nghĩa rules

validator.isRequired = function(selector,mess){
    return {
        selector: selector,
        test:function(value){
            return value ? undefined : mess;
        }
    }
};

//xác nhận email
validator.isEmail = function(selector,mess){
    return {
        selector: selector,
        test:function(email){
            let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return res.test(email)?undefined:mess;
        }

    }
};

//xử lý khi nhập mật khẩu
validator.minLength = function(selector,min,mess){
    return {
        selector: selector,
        test:function(value){
            return value.length >= min ? undefined : mess;
        }

    }
};

//xác nhận mật khẩu đã nhập
validator.confirm = function(selectorConfirm,selector,mess){
    return {
        selector: selector,
        test:function(value){
            
            var passwordConfirm = document.querySelector(selectorConfirm).value;
            return value == passwordConfirm ? undefined : mess;
        }

    }
};