(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com/menu_items.json')
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItemsTemplate.html',
    scope: {
      items: '<',
      onRemove: '&',
      errorMsg: '<'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'Directivelist',
    bindToController: true,
    link: FoundItemsDirectiveLink
  };

  return ddo;
}

function FoundItemsDirectiveController() {
  var Directivelist = this;
  console.log(this);
  Directivelist.isEmpty = function() {
    
    if (Directivelist.items )
     {
       console.log(Directivelist.items);
       if ( Directivelist.items.length != 0)
       {
          return false;
       }
     }
    return false;
  }
}  

function FoundItemsDirectiveLink(scope, element, attribute, controller) {
  scope.$watch('Directivelist.isEmpty()', function(newValue, oldValue){
      
    if(newValue === true) {
      element.find("span.error").toggle(1000)
      
    } else {
      element.find("span.error").toggle(1000)
      
    }
  });

}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {

  var menu = this;

  menu.itemName = "";
  menu.items =[];
  menu.errorMsg="";

  menu.found = function () {
    menu.items =[];
    menu.errorMsg="";
    
  
    if( menu.itemName.trim() !== "" ) {
      MenuSearchService.getMatchedMenuItems(menu.itemName)
      .then(function (response) {
         menu.items = response.foundItems;
         console.log(menu.items)
         if (menu.items.length ==0 ) {
          
          menu.errorMsg="Nothing Found";
          console.log(menu.errorMsg);
        }
      })
        .catch(function (error) {
          console.log("Something went terribly wrong.");
        })
      } else {
         menu.errorMsg="Please enter something to search for";
         }
    console.log(menu.errorMsg);
    };
    menu.removeItem = function (itemIndex) {
       menu.items.splice(itemIndex, 1); 
  }

};


MenuSearchService.$inject = ['$http', 'ApiBasePath', '$q'];
function MenuSearchService ($http, ApiBasePath, $q) {
  var service = this;

    service.foundItems=[];

      service.getMatchedMenuItems = function (searchTerm) {
        var deferred = $q.defer();
        var response = $http({
      method: "GET",
      url: (ApiBasePath )
    })
    // process result and only keep items that match
    response.success(function(data) {
      var allItems = data.menu_items;
      var fItems= [];
      for (var i =0; i <allItems.length; i++) {
        if (allItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
          fItems.push(allItems[i]);
        }
      }
      deferred.resolve({
        "foundItems" : fItems
      })
    })
    .error(function(msg, code) {
      deferred.reject(msg);
    });

    // return processed items
    return deferred.promise;
};

}


})();
