
exports.generate = function($,form,inputObj) {
    switch(inputObj['input-type']) {
        case 'text':
            addSimpleInput(inputObj);
            break;
        case 'password':
            addSimpleInput(inputObj);
            break;
    }

    function addSimpleInput(inputObj) {
        var element = $('<input type="'+inputObj['input-type']+'"></input>');
        var possibleAttributs = [
            
            ];
        if (inputObj.name)      element.attr('name',inputObj.name);
        if (inputObj.id)        element.attr('id',inputObj.id);
        if (inputObj.required)  element.attr('required',inputObj.required);
        form.append(element);
    }
};

