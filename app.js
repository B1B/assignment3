var myModule = angular.module('StudentQuizApp', []);

myModule.controller('QuizProgramController', ['$scope', 'StudentListModule', 'QuestionListModule', 'LocalStorageService',
function($scope, StudentListModule, QuestionListModule, LocalStorageService) {

    var qpc = this;

    /*qpc.students = [
        {
            name: "Jeffry",
            correct: 0,
            wrong: 0
        },

        {
            name: "Brandon",
            correct: 0,
            wrong: 0
        },

        {
            name: "Mary",
            correct: 0,
            wrong: 0
        },

        {
            name: "Sarmi",
            correct: 0,
            wrong: 0
        }, 
        {
            name: "Juan",
            correct: 0,
            wrong: 0
        },
           {
            name: "Matt",
            correct: 0,
            wrong: 0
        },
           {
            name: "Tony",
            correct: 0,
            wrong: 0
        },
           {
            name: "Jordan",
            correct: 0,
            wrong: 0
        }
    ];*/
    
    qpc.students_completed = [];
    
    qpc.students = StudentListModule.studentFunction().then(function (data) {
        qpc.students = data.students;
    });

    /*qpc.questions = [{
            question: "What does AngularJS extend?",
            answer: "HTML"
        },

        {
            question: "Often reffered to as the glue between the template and the controller?",
            answer: "What is Scope?"
        },

        {
            question: "ng-app is a type of what?",
            answer: "Directive"
        },

        {
            question: "Angular binds data to HTML by using what?",
            answer: "Expressions"
        }, {
            question: "The ______ is a container for different parts of the application?",
            answer: "Module"
        }
    ];*/

    qpc.questions_completed = [];
    
     qpc.questions = QuestionListModule.questionFunction().then(function (data) {
        qpc.questions = data.questions;
    });
    
    qpc.getNextQuestion = function(){
        
        if(qpc.questions.length > 0){
            var index = Math.floor(Math.random() * qpc.questions.length);
            
            qpc.selected_question = qpc.questions[index];
            
            qpc.questions_completed.push(qpc.selected_question);
            
            qpc.questions.splice(index, 1);     
            
        }
        else{
            qpc.questions = qpc.questions_completed;
            qpc.questions_completed = [];
        }
    };
    
    qpc.getNextStudent = function(){
        
        if(qpc.students.length > 0){
            var index = Math.floor(Math.random() * qpc.students.length);
             
            qpc.selected_student = qpc.students[index];
             
            qpc.students_completed.push(qpc.selected_student);
             
            qpc.students.splice(index, 1);
        }
        else{
            qpc.students = qpc.students_completed;
            qpc.students_completed = [];
        }
    };
       
    qpc.getNext = function(){
            qpc.getNextQuestion();
            qpc.getNextStudent();
    };
    
    qpc.doCorrect = function(){
        qpc.selected_student.correct++;
        qpc.getNext();
    };
    
    qpc.doWrong = function(){
        qpc.selected_student.wrong++;
        qpc.getNext();        
    };
    
    /*qpc.latestData=  function(){
        return LocalStorageService.getData();
    };
    
    qpc.update = function(val){
        return LocalStorageService.setData(val);
    };

    qpc.update(angular.toJson(qpc.students));
    qpc.students = LocalStorageService.getdata();*/
        
}]);

//question service factory
myModule.factory('QuestionListModule', ['$http', function ($http) {
    return {
        questionFunction: function () {
            return $http.get('questions.json').then(function(response){
                return response.data;
            });
        }
    };

}]);

//student service factory
myModule.factory('StudentListModule', ['$http', function ($http) {
    return {
        studentFunction: function () {
            return $http.get('students.json').then(function(response){
                return response.data;
            });
        }
    };

}]);

//store students and their scores locally
myModule.factory("LocalStorageService", function($window, $rootScope) {
    
    angular.element($window).on('storage', function(event) {
        if (event.key === 'my-storage') {
            $rootScope.$apply();
        }
    });    
    
    return {
        setData: function(val) {
            $window.localStorage && $window.localStorage.setItem('my-storage', val);
            return this;
        },
        getData: function() {
            
            var val = $window.localStorage && $window.localStorage.getItem('my-storage');
            
            var data = angular.fromJson(val);
            
            return data; 
        }
    };
});

/**
 * You should probably be able to use 
 * 
 * qpc.questions = myServiceModule.questionFunction(); If this doesn't work, use
 * the below
 * 
 * 
 *  myServiceModule.questionFunction().then(function (data) {
        qpc.questions = data.questions;
    });
 */

/**
 * So at this point we need to actually get the json file using angular's $http
 * dependency(?).
 * 
 * after getting the file, the next thing to do would be to use .then() in order
 * to do something with the file. then accepts three functions as parameters, but
 * we really only need to pass it one.
 * 
 * Unlike in the controller, we can't access the scope, so we return the response.data
 * instead of assigning it to a variable. Also, before $http.get put a return since
 * we also have to return that as well
 */


/**
 * So in C# we created methods that returned values sometimes.
 * 
 * In javascript, or at least angular, we return a value whenever
 * we create a service using factory. This value is an object which
 * we use to access the service.
 * 
 * Two approaches to this are to simply do:
 * 
 *  myModule.factory('myServiceModule', ['$http', function () {
 *       return {
 *           someFunction: function () {
 *               do stuff here
 *           },
 *           someVariable: 2,
 *           etc.
 *       }
 *   }]);
 *   
 *   the other approach is to do:
 *   
 *   myModule.factory('myServiceModule', ['$http', function () {
 *       myServiceModule = {}; // an empty object
 *       
 *       myServiceModule.someFunction = function () {
 *           do stuff here
 *       }
 *       
 *       return myServiceModule;
 *   }]);
 */ 