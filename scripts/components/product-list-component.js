(function() {
  'use strict';

  class ProductListComponentController {
    constructor($filter, $stateParams, ProductsService) {
      this.$filter = $filter;
      this.$stateParams = $stateParams;
      this.ProductsService = ProductsService;
      this.PRODUCTS_PER_PAGE = 6;
    }

    $onInit() {
      this.ProductsService.$get({
        page: parseInt(this.$stateParams.page, 10) || 1,
        name: this.$stateParams.name
      })
        .then(data => this._processProducts(data));
    }

    $onChanges(changes) {
      if (changes.query && !changes.query.isFirstChange()) {
        this.ProductsService.$get({
          page: parseInt(this.$stateParams.page, 10) || 1,
          name: changes.query.currentValue
        })
          .then(data => this._processProducts(data));
      }
    }

    _processProducts({ data, headers }) {
      this.products = data;
      this.totalProducts = parseInt(headers('X-Total-Count'), 10);
    }
  }

  angular.module('shop')
    .component('productList', {
      template: () => `
        <form class="col s12">
            <div class="row">
                <div class="input-field col s6 offset-s6">
                    <input id="product-name"
                        type="text"
                        placeholder="Filtruj po nazwie"
                        ng-model="$ctrl.nameFilter" />
                </div>
            </div>
        </form>

        <pagination
            total-items="$ctrl.totalProducts"
            items-per-page="$ctrl.PRODUCTS_PER_PAGE"
            state-name="products"
            query-params="{name: $ctrl.query}">
        </pagination>

        <div class="col s4" ng-repeat="product in $ctrl.products | filter : {name: $ctrl.nameFilter} track by product.id">
            <product class="row" data="product"></product>
        </div>
      `,
      controller: ProductListComponentController,
      bindings: {
        query: '<'
      }
    });
}());
