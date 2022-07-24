function validator(formSelector){

    //lấy ra form element trong DOM trong 'formSelector'
    const formElement = document.querySelector(formSelector);   

    //object chứa 'name' của các  input selector
    var formRules = {};

    //quy ước tạo rule ( có lỗi trả error message , ko lỗi trả về undefind )
    var validatorRules = {
        required: function(value){
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function(email){
            let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return res.test(email) ? undefined : 'Trường này không phải email';
        },
        min: function(min){
            return function(value){
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
            }
        }
        
    };

    //hàm xử lý việc lấy thằng cha theo yêu cầu
    function getParent(selector,formSelector){
        let parent = selector.parentElement;
        while (selector.parentElement) {
            if(parent.matches(`${formSelector}`)){
                return parent;
            }
            parent = selector.parentElement;
        }
    }


    const _this = this;


    //có form thì mới xử lý tiếp  (đề phòng sai tên biến ,..)
    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rules]')
        
        for(let input of inputs) {
            var ruleInfor;
            var rules = input.getAttribute('rules').split('|')
            for(let rule of rules){

                var isRuleHaveValue = rule.includes(':')

                //xử lý khi sử dụng hàm min
                if(isRuleHaveValue){
                    ruleInfor = rule.split(':');
                    rule = ruleInfor[0];
                }

                var ruleFun = validatorRules[rule];
                if(isRuleHaveValue){
                    ruleFun = ruleFun(ruleInfor[1])
                }

                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFun)
                }else{
                    formRules[input.name]=[ruleFun];
                }
            }

            

            //lắng nghe sự kiện(change , blur ,..)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }


            
        function handleValidate(event){
            var rules = formRules[event.target.name];
            var formGroup = getParent(event.target,'.form-group');
            var formMessError = formGroup.querySelector('.form-message');
            var errorMess;


            //gọi hàm xử lý , tìm kiếm mess lỗi
            rules.some(function(rule){
                errorMess = rule(event.target.value);
                return errorMess;
                
            });

            //hiện thị message lỗi
            if(formGroup){
                if(errorMess){
                    formMessError.innerText = errorMess;
                    formGroup.classList.add('invalid');
                }else{
                    formMessError.innerText = '';
                    formGroup.classList.remove('invalid');
                }
            }

            return !!errorMess;

        }

        function handleClearError(event){

            var formGroup = getParent(event.target,'.form-group');
            var formMessError = formGroup.querySelector('.form-message');

            if(formGroup.classList.contains('invalid') ){
                formMessError.innerText = '';
                formGroup.classList.remove('invalid'); 
            }
        }
    }

        
    //xử lý hành vi submit form
    formElement.onsubmit = function(event){
        event.preventDefault();

        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;
        
        for(let input of inputs) {
            if(handleValidate({target : input})){
                isValid = false;
            }
        }

        if(isValid){

            if(typeof _this.onSubmit === 'function'){
                var API = {};

                var inputs = formElement.querySelectorAll('input');
                for(let input of inputs) {
                    switch (input.type){
                        case 'radio':
                            break;
                            
                    
                        default:
                            API[input.name] = input.value;
                    }
                }

                _this.onSubmit(API);

                
            }else{
                formElement.submit();
            }
        }
    }

        
        
}