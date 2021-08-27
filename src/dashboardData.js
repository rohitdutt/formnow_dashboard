const {firebaseDatabase} = require("./firebase/firebaseConfig");

const dashboardData = async (req, res) => {
    let response = {'ratings':{} , 'dropdown':{}};
    let fieldsListRatings = [];
    let fieldsListDropdown = [];
    let responseList = [];
    try{
        const fields = await firebaseDatabase.collection("forms").doc(req.body.formId).get();
        const responses = await firebaseDatabase.collection("response").where("formId" , "==" , req.body.formId).get();
        fields.data().formFields.forEach(field => {
            if(field.fieldType == "ratings"){
                fieldsListRatings.push(field.fieldName);
                response['ratings'][`${field.fieldName}`] = [0, 0, 0, 0, 0];
            }
            if(field.fieldType == "Dropdown"){
                fieldsListDropdown.push(field);
            }
        })
        fieldsListDropdown.forEach(dropdown =>{
            console.log(dropdown)
            response['dropdown'][dropdown.fieldName] = {};
            for (let i = 0;i < dropdown.options.length;i++) {
                response['dropdown'][dropdown.fieldName][dropdown.options[i].fieldValue.trim()] = 0;
            }
        });
        responses.forEach(doc => responseList.push(doc.data().response));
        responseList.forEach(resp =>{
            for (let i = 0; i < fieldsListRatings.length; i++) {
                if(resp[`${fieldsListRatings[i]}`]) {
                    response['ratings'][`${fieldsListRatings[i]}`][resp[`${fieldsListRatings[i]}`].split('/')[0] - 1] += 1;
                }
            }
            for(let i = 0;i < fieldsListDropdown.length; i++){
                if(response['dropdown'][fieldsListDropdown[i].fieldName][resp[fieldsListDropdown[i].fieldName]] !== undefined){
                    response['dropdown'][fieldsListDropdown[i].fieldName][resp[fieldsListDropdown[i].fieldName]] += 1;
                }
            }
        });
        response['noOfResponses'] = responseList.length;
        res.send(response);
    }catch (e) {
        res.status(404);
        res.send({message: 'error'});
    }
}

module.exports = {dashboardData}