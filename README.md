# mfp70watsonqa

This is a sample project that uses IBM MobileFirst Platform 7.0 and IBM Bluemix Watson Question and Answer Service to build a simple Mobile Hybrid application that allows user to make questions and receive answers using natural language about specific topics like healthcare and travel.

For an overview and how to use this app read the details in the following post at IBM MobileFirst Blog

https://developer.ibm.com/mobilefirstplatform/2015/04/29/using-http-adapters-to-access-watson-question-and-answer-service-at-ibm-bluemix/

To use this app

1.Fork the project or dowanload it as a zip file. It contains a MobileFirst Platform 7.0 project ready to be imported.

2.Import the project WatsonQA – File > Import > Existing Projects and select the .zip downloaded

3.Expand the project folder and open the file adapters/WatsonQA/WatsonQA.xml

4.Update the values of the parameters and according to the credentials for WQ&A service obtained from Bluemix.

5.Right click on the folder adapters/WatsonQA and select Run As > Deploy MobileFirst Adapter to deploy the adapter

6.Right click on the folder apps/WatsonQA and select Run As > Run on MobileFirst Server to deploy the sample app

7.To preview the app in a browser Right click on the folder apps/WatsonQA/common and select Run As > Preview and the app will load in a browser

8.Try to send some questions to test Watson skills

9.The answers and evidence will be presented in the app body along with the confidence level for each answer and the option to provide feedback to Watson is available with the stars (4 stars means a relevant answer and 1 star is for an irrelevant answer)
