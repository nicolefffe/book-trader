function dialogCreate() {
  return {
    controller: 'SearchCtrl as search',
    template: [

    ]
  };
};

angular
.module('book-app')
.directive('dialogCreate', dialogCreate);
