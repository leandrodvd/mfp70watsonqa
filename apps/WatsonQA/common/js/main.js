//global vars

var question;
var answers;
var evidenceList;
var busyInd;

function wlCommonInit(){
	/*
	 * Use of WL.Client.connect() API before any connectivity to a Worklight Server is required. 
	 * This API should be called only once, before any other WL.Client methods that communicate with the Worklight Server.
	 * Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 */
	
	// Common initialization code goes here
	init();
}

function init(){
	busyInd = new WL.BusyIndicator (null, {text: "Please wait..."});
	updateQuestionTypeList();
	
}

/**
 * getWatsonQAServices will call the procedure getServices to retrieve all the available 
 * question domains for the QA services
 * @param onSuccessCallback - Callback function to run on success
 * @param onFailCallback - Callback function to run on fail
 */
function getWatsonQAServices(onSuccessCallback,onFailCallback){
	var invocationData = {
	        adapter : 'WatsonQA',
	        procedure : 'getServices',
	        parameters : []
	    };
	
	var options = {
		onSuccess : onSuccessCallback,
		onFailure : onFailCallback,
	};

	WL.Client.invokeProcedure(invocationData,options);
}

/**
 * Call the postQuestion procedure
 * @param question - The question string to be sent. Example: "What are the symptoms of diabete?s
 * @param type - A string with the type of question, must be a service obtained with the 
 * getWatsonQAServices function. Examples: "healthcare" or "travel
 * @param onSuccessCallback - Callback function to run on success
 * @param onFailCallback - Callback function to run on fail
 */
function postQuestion(question, type, onSuccessCallback, onFailCallback){
	var invocationData = {
	        adapter : 'WatsonQA',
	        procedure : 'postQuestion',
	        parameters : [question,type]
	    };
	
	var options = {
		onSuccess : onSuccessCallback,
		onFailure : onFailCallback,
	};

	WL.Client.invokeProcedure(invocationData,options);
}

/**
 * this function receives a feedback index as a number between 0 and 4 and
 * convert feedback to watson feedback standard like explained 
 * feedback (string, optional) = ['-1' or '0' or '1' or '9']:  
 * String representation of the feedback [-1 = answers was irrelevant, 
 * 0=neutral feedback, 
 * 1=answer was relevant, 
 * 9=answer was partially relevant],
 * @param answerIndex - id of the answer that will receive feedback
 * @param feedbackIndex - Feedback value- must be a number between 0 and 4
 *  @param onSuccessCallback - Callback function to run on success
 * @param onFailCallback - Callback function to run on fail
 */
function putFeedback(answerIndex,feedbackIndex, onSuccessCallback, onFailCallback){
	
	var watsonFeedbackIndex=0;
	if(feedbackIndex==1){
		watsonFeedbackIndex=-1;//irrelevant
	}
	else if(feedbackIndex==2){
		watsonFeedbackIndex=0;//neutral
	}
	else if(feedbackIndex==3){
		watsonFeedbackIndex=9;//partially relevant
	}
	else if(feedbackIndex==4){
		watsonFeedbackIndex=1;//relevant
	}
	
	var invocationData = {
	        adapter : 'WatsonQA',
	        procedure : 'putFeedback',
	      //[_questionId,_questionText,_answerId,_answerText,_confidence,_feedback]
	        parameters : [question.id,
	                      question.questionText,
	                      answers[answerIndex].id,
	                      answers[answerIndex].text,
	                      answers[answerIndex].confidence,
	                      watsonFeedbackIndex]
	    };
	//alert("invocation parameters:"+invocationData.parameters);
	var options = {
		onSuccess : onSuccessCallback,
		onFailure : onFailCallback,
	};

	WL.Client.invokeProcedure(invocationData,options);
}



function askWatson(){
	busyInd.show();
	var question = $("#qasearch").val();
	var type = $("input[name=radio_questiontype]:checked").val();
	$("#qasearch").blur();
	//alert("Question:"+question+" Type:"+type);
	postQuestion(question,type,askWatsonSuccess,askWatsonFail);
	
	
	return false
}

function askWatsonSuccess(result){
	busyInd.hide();
	//alert("SUCCESS "+ result.invocationResult.isSuccessful + " "+result.invocationResult.statusCode);
	if(result.invocationResult.isSuccessful && result.invocationResult.statusCode==200){
		question = result.invocationResult.array[0].question;
		answers = result.invocationResult.array[0].question.answers;
		evidenceList = result.invocationResult.array[0].question.evidencelist;
		
		updateAnswers(answers);
		updateEvidences(evidenceList);
		
	}
	else{
		askWatsonFail(result);
	}
}



function askWatsonFail(result){
	busyInd.hide();
	//alert("FAIL:"+result);
	clearAnswers();
	clearEvidences();
	WL.Logger.error("Question Post FAILED "+result.invocationResult.statusCode+"  "+result.invocationResult.statusReason);
}

function updateAnswers(answers){
	clearAnswers();
	for (var i = 0; i < answers.length; i++) {
		//$("#ul_answers").append("<li>"+answers[i].text+"</li>");
		var confidence = (answers[i].confidence *100).toFixed(2);
		var codeToAppend = '<li class="answer-item">' ;
			codeToAppend +='<div  data-role="collapsible" data-collapsed="false">';
			codeToAppend +='<h3>'+confidence+'%';	
			codeToAppend +='</h3>';
			codeToAppend +=answers[i].text;
			codeToAppend +='<br>';
			codeToAppend +='<a href="#" id="feedbackicon_answer_'+i+'_1" class="ui-btn ui-corner-all ui-icon-star ui-btn-icon-notext  ui-btn-inline" onClick="onFeedbackIconClicked('+i+',1)"></a>';//add class ui-btn-b to make the star dark when selected
			codeToAppend +='<a href="#" id="feedbackicon_answer_'+i+'_2" class="ui-btn ui-corner-all ui-icon-star ui-btn-icon-notext  ui-btn-inline" onClick="onFeedbackIconClicked('+i+',2)"></a>';
			codeToAppend +='<a href="#" id="feedbackicon_answer_'+i+'_3" class="ui-btn ui-corner-all ui-icon-star ui-btn-icon-notext  ui-btn-inline" onClick="onFeedbackIconClicked('+i+',3)"></a>';
			codeToAppend +='<a href="#" id="feedbackicon_answer_'+i+'_4" class="ui-btn ui-corner-all ui-icon-star ui-btn-icon-notext  ui-btn-inline" onClick="onFeedbackIconClicked('+i+',4)"></a>';
			codeToAppend +='</div></li>';
		
		$("#ul_answers").append(codeToAppend);	
	}
	$("div").trigger("create");
}

function onPutFeedbackSuccess(result){
	if(result.invocationResult.isSuccessful && result.invocationResult.statusCode==200){
		WL.Logger.debug("Feedback put with success");
	}
	else{
		onPutFeedbackFail(result);
	}
}

function onPutFeedbackFail(result){
	//alert("Feedback put FAILED "+result.invocationResult.statusCode+"  "+result.invocationResult.statusReason);
	WL.Logger.error("Feedback put FAILED "+result.invocationResult.statusCode+"  "+result.invocationResult.statusReason);
}

function onFeedbackIconClicked(answerIndex,feedbackIndex){
	//alert("Feedback:"+feedbackIndex+"Answer:"+answerIndex);
	setFeedbackIcons(answerIndex,feedbackIndex);
	putFeedback(answerIndex,feedbackIndex,onPutFeedbackSuccess,onPutFeedbackFail);
}




function setFeedbackIcons(answerIndex,feedbackIndex){
	//first lets clean all feedback icons
	feedbackIconsClear(answerIndex);
	//them lets set all feedback icons that at left of the selected icon
	for (var i=1;i<=feedbackIndex;i++){
		setSingleFeedbackIcon(answerIndex,i);
	}
}

function setSingleFeedbackIcon(answerIndex,feedbackIndex){
	var id= '#feedbackicon_answer_'+answerIndex+'_'+feedbackIndex;
	$(id).addClass('ui-btn-b');
	$(id).trigger('create');
}

function feedbackIconsClear(answerIndex){
	for (var i=1;i<=4;i++){
		var id= '#feedbackicon_answer_'+answerIndex+'_'+i;
		$(id).removeClass('ui-btn-b');
		$(id).trigger('create');
	}
}

function updateEvidences(evidenceList){
	clearEvidences();
	for (var i = 0; i < evidenceList.length; i++) {
		//$("#ul_evidences").append("<li>"+evidenceList[i].text+"</li>");
		$("#ul_evidences").append('<li class="answer-item"><div  data-role="collapsible" data-collapsed="false"><h3>'+evidenceList[i].title+'%</h3>'+evidenceList[i].title+'<br><br>'+evidenceList[i].text+'</div></li>');
		
	}
	$("div").trigger("create");
	
}

function clearAnswers(){
	$("#ul_answers").empty();
}

function clearEvidences(){
	$("#ul_evidences").empty();
}



function updateQuestionTypeList(){
	busyInd.show();
	getWatsonQAServices(getWatsonQAServicesSuccess,getWatsonQAServicesFail);
}

function getWatsonQAServicesSuccess(result){
	busyInd.hide();
	if(result.invocationResult.isSuccessful){
		WL.Logger.debug("getWatsonQAServices Success");
		var questionTypes=result.invocationResult.array;
		
		updateQuestionTypeFieldset(questionTypes);
		
	}
	else{
		getWatsonQAServicesFail(result)
	}
}

function getWatsonQAServicesFail(result){
	busyInd.hide();
	WL.Logger.error("getWatsonQAServices FAIL");
}
function updateQuestionTypeFieldset(questionTypes){
	clearQuestionTypes();
	for (var i = 0; i < questionTypes.length; i++) {
		var typeId= questionTypes[i].id;
		var typeName = questionTypes[i].name;
		
		$("#fieldset_questiontype").append('<input name="radio_questiontype" id="radio_questiontype_'+typeId+'" type="radio" checked="checked" value="'+typeId+'">');
		$("#fieldset_questiontype").append('<label for="radio_questiontype_'+typeId+'">'+typeName+'</label>');
		
		
		
	}
	$("#fieldset_questiontype").trigger( "create" );
	
}
function clearQuestionTypes(){
	$("#fieldset_questiontype").empty();
}