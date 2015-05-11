/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 *  WL.Server.invokeHttp(parameters) accepts the following json object as an argument:
 *  
 *  {
 *  	// Mandatory 
 *  	method : 'get' , 'post', 'delete' , 'put' or 'head' 
 *  	path: value,
 *  	
 *  	// Optional 
 *  	returnedContentType: any known mime-type or one of "json", "css", "csv", "javascript", "plain", "xml", "html"  
 *  	returnedContentEncoding : 'encoding', 
 *  	parameters: {name1: value1, ... }, 
 *  	headers: {name1: value1, ... }, 
 *  	cookies: {name1: value1, ... }, 
 *  	body: { 
 *  		contentType: 'text/xml; charset=utf-8' or similar value, 
 *  		content: stringValue 
 *  	}, 
 *  	transformation: { 
 *  		type: 'default', or 'xslFile', 
 *  		xslFile: fileName 
 *  	} 
 *  } 
 */



function ping(){
	var input = {
		    method : 'get',
		    returnedContentType : 'json',
		    path : '/qagw/service/v1/ping'
		};
	
	return WL.Server.invokeHttp(input);
}

function getServices(){
	var input = {
		    method : 'get',
		    returnedContentType : 'json',
		    path : '/qagw/service/v1/services'
		};
	
	return WL.Server.invokeHttp(input);
}

function postQuestion(question_text,type){
	
	var input = {
			method : 'post',
			path: '/qagw/service/v1/question/'+type,
			returnedContentType: 'json',
			body: {	
				contentType: 'application/json',
				content: {
		   			question: {
		      			questionText:question_text
					}
				}
			}
		}
;
	
	return WL.Server.invokeHttp(input);
	
	
}

function putFeedback(_questionId,_questionText,_answerId,_answerText,_confidence,_feedback){
	
	var input = {
			method : 'put',
			path: '/qagw/service/v1/feedback',
			returnedContentType: 'json',
			body: {	
				contentType: 'application/json',
				content: {
					  questionId: _questionId,
					  questionText: _questionText,
					  answerId: _answerId,
					  answerText: _answerText,
					  confidence: _confidence,
					  shown: true,
					  feedback: _feedback
					}
				}
		};
	
	return WL.Server.invokeHttp(input);
	
}