var app = angular.module("app", ["ngSanitize", "ngRoute", "slickCarousel"]);

app.run(function ($rootScope, $http, $window) {
  $rootScope.list = [];
  $rootScope.search_list = [];
  $rootScope.input;
  $http.get("./json/product.json").then(function (a) {
    $rootScope.list = a.data.plant;
    // start set page news
    $rootScope.pagesize = 6;
    $rootScope.totalPages = Math.ceil($rootScope.list.length / $rootScope.pagesize);
    $rootScope.currentPage = 0;
    $rootScope.pages = [];
    for (let i = 0; i < $rootScope.totalPages; i++) {
      $rootScope.pages[i] = $rootScope.list.slice(i * $rootScope.pagesize, (i + 1) * $rootScope.pagesize);
    }
    // end

    $http.get("./json/product.json").then(function (a) {
      $rootScope.product_detail = a.data.plant;
    });
  });

  $rootScope.totalCart = JSON.parse(localStorage.getItem("totalItem")) || [];

  window.addEventListener("scroll", function () {
    const mainNav = document.querySelector(".main-nav");
    if ($window.pageYOffset == 0) {
      mainNav.classList.remove("shadow");
      mainNav.classList.remove("sticky-top");
      mainNav.classList.remove("nav-animation");
    }

    if ($window.pageYOffset > 120) {
      mainNav.classList.add("shadow");
      mainNav.classList.add("sticky-top");
      mainNav.classList.add("nav-animation");
    }
  });

  $rootScope.list_blog = [];
  $rootScope.search_list_blog = [];
  $rootScope.input_blog;
  $http.get("./json/blog.json").then(function (a) {
    $rootScope.list_blog = a.data;
    // start set page news
    $rootScope.pagesize_blog = 4;
    $rootScope.totalPages_blog = Math.ceil($rootScope.list_blog.length / $rootScope.pagesize_blog);
    $rootScope.currentPage_blog = 0;
    $rootScope.pages_blog = [];
    for (let i = 0; i < $rootScope.totalPages_blog; i++) {
      $rootScope.pages_blog[i] = $rootScope.list_blog.slice(i * $rootScope.pagesize_blog, (i + 1) * $rootScope.pagesize_blog);
    }
    // end
  });

  $http.get("./json/blog.json").then(function (a) {
    $rootScope.ds = a.data;
  });

  $rootScope.visitedCount = 0;
  $rootScope.currentOnline = 0;

  window.addEventListener("load", function () {
    if (localStorage.getItem("visitedCount") == null) {
      this.localStorage["visitedCount"] = 99;
    }

    if (localStorage.getItem("currentOnline") == null) {
      this.localStorage["currentOnline"] = 1;
    }

    $rootScope.visitedCount = parseInt(this.localStorage["visitedCount"]) + 1;
    $rootScope.currentOnline = parseInt(this.localStorage["currentOnline"]) + 1;

    localStorage.setItem("visitedCount", $rootScope.visitedCount);
    localStorage.setItem("currentOnline", $rootScope.currentOnline);
  });

  window.addEventListener("unload", function () {
    if (localStorage.getItem("currentOnline") == null) {
      this.localStorage["currentOnline"] = 12;
    }

    if ($rootScope.currentOnline <= 1) return;
    $rootScope.currentOnline = parseInt(this.localStorage["currentOnline"]) - 1;

    localStorage.setItem("currentOnline", $rootScope.currentOnline);
  });
});

app.config(function ($routeProvider) {
  $routeProvider
    .when("/blogInfo", {
      templateUrl: "./html/blog-info.html",
    })
    .when("/productList", {
      templateUrl: "./html/product.html",
    })
    .when("/product_detail", {
      templateUrl: "./html/product_detail.html",
    })
    .when("/cart", {
      templateUrl: "./html/cart.html",
    })
    .when("/blog", {
      templateUrl: "./html/blog-list.html",
    })
    .when("/blog-infor", {
      templateUrl: "./html/blog-infor.html",
    })
    .when("/feedback", {
      templateUrl: "./html/feedback.html",
    })
    .when("/pay", {
      templateUrl: "./html/pay.html",
    })
    .otherwise({
      templateUrl: "./html/home.html",
    });
});

app.filter("searchBlog", function () {
  return function (list_blog, a) {
    if (a) {
      var filteredList = [];
      for (let i = 0; i < list_blog.length; i++) {
        if (list_blog[i].title.toLowerCase().indexOf(a.toLowerCase()) !== -1) {
          filteredList.push(list_blog[i]);
        }
      }
      return filteredList;
    }
  };
});

app.filter("search", function () {
  return function (list, a, size, price, typeplant) {
    if (a === undefined && (size === undefined || size === "all") && price === undefined && typeplant === undefined) {
      return list;
    }

    if (a === undefined && size !== "all" && size !== undefined && price === undefined && typeplant === undefined) {
      var filteredList = [];
      for (let i = 0; i < list.length; i++) {
        if (size === list[i].size) {
          filteredList.push(list[i]);
        }
      }
      return filteredList;
    }
    if (a === undefined && (size === "all" || size === undefined) && price === undefined && typeplant !== undefined) {
      var filteredList = [];

      for (let i = 0; i < list.length; i++) {
        if (typeplant === list[i].type) {
          filteredList.push(list[i]);
        }
        console.log(filteredList);
      }
      return filteredList;
    }
    if (a === undefined && size !== "all" && size !== undefined && price === undefined && typeplant !== undefined) {
      var filteredList = [];
      for (let i = 0; i < list.length; i++) {
        if (size === list[i].size && list[i].type === typeplant) {
          filteredList.push(list[i]);
        }
      }
      return filteredList;
    }
    if (a === undefined && (size === undefined || size === "all") && price !== undefined && typeplant === undefined) {
      var filteredList = [];
      if (price === "lower10") {
        for (let i = 0; i < list.length; i++) {
          if (list[i].price < 10) {
            filteredList.push(list[i]);
          }
        }

        return filteredList;
      }
      if (price === "upper10") {
        for (let i = 0; i < list.length; i++) {
          if (list[i].price > 10) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if (price === "5-10") {
        for (let i = 0; i < list.length; i++) {
          if (list[i].price < 10 && list[i].price > 5) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
    }
    if (a === undefined && size !== "all" && size !== undefined && price !== undefined && typeplant === undefined) {
      var filteredList = [];
      if (price === "lower10") {
        for (let i = 0; i < list.length; i++) {
          if (size === list[i].size && list[i].price < 10) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if (price === "upper10") {
        for (let i = 0; i < list.length; i++) {
          if (size === list[i].size && list[i].price > 10) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if (price === "5-10") {
        for (let i = 0; i < list.length; i++) {
          if (size === list[i].size && list[i].price < 10 && list[i].price > 5) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
    }
    if (a === undefined && (size === "all" || size === undefined) && price !== undefined && typeplant !== undefined) {
      var filteredList = [];
      if (price === "lower10") {
        for (let i = 0; i < list.length; i++) {
          if (typeplant === list[i].type && list[i].price < 10) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if (price === "upper10") {
        for (let i = 0; i < list.length; i++) {
          if (typeplant === list[i].type && list[i].price > 10) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if (price === "5-10") {
        for (let i = 0; i < list.length; i++) {
          if (typeplant === list[i].type && list[i].price < 10 && list[i].price > 5) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
    }
    if (a === undefined && size !== "all" && size !== undefined && price !== undefined && typeplant !== undefined) {
      var filteredList = [];
      if (price === "5-10") {
        for (let i = 0; i < list.length; i++) {
          if (size === list[i].size && list[i].price < 10 && list[i].price > 5 && typeplant === list[i].type) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if (price === "upper10") {
        for (let i = 0; i < list.length; i++) {
          if (size === list[i].size && list[i].price > 10 && typeplant === list[i].type) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if (price === "lower10") {
        for (let i = 0; i < list.length; i++) {
          if (size === list[i].size && list[i].price < 10 && typeplant === list[i].type) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
    }
    if (a !== undefined && typeof a === "string" && a !== "") {
      var filteredList = [];
      if ((size === undefined || size === "all") && price === undefined && typeplant === undefined) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if ((size === undefined || size === "all") && price !== undefined && typeplant === undefined) {
        if (price === "lower10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].price < 10) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
        if (price === "upper10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].price > 10) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
        if (price === "5-10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].price < 10 && list[i].price > 5) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
      }
      if (size !== undefined && size !== "all" && price === undefined && typeplant === undefined) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].size === size) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if ((size === undefined || size === "all") && price === undefined && typeplant !== undefined) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].type === typeplant) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if ((size === undefined || size === "all") && price !== undefined && typeplant !== undefined) {
        if (price === "lower10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].type === typeplant && list[i].price < 10) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
        if (price === "upper10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].type === typeplant && list[i].price > 10) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
        if (price === "5-10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].type === typeplant && list[i].price < 10 && list[i].price > 5) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
      }
      if (size !== undefined && size !== "all" && price === undefined && typeplant !== undefined) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].size === size && list[i].type === typeplant) {
            filteredList.push(list[i]);
          }
        }
        return filteredList;
      }
      if (size !== undefined && size !== "all" && price !== undefined && typeplant === undefined) {
        if (price === "lower10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].size === size && list[i].price < 10) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
        if (price === "upper10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].size === size && list[i].price > 10) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
        if (price === "5-10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].size === size && list[i].price < 10 && list[i].price > 5) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
      }
      if (size !== undefined && size !== "all" && price !== undefined && typeplant !== undefined) {
        if (price === "lower10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].size === size && list[i].price < 10 && typeplant === list[i].type) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
        if (price === "upper10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].size === size && list[i].price > 10 && typeplant === list[i].type) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
        if (price === "5-10") {
          for (let i = 0; i < list.length; i++) {
            if (list[i].name.toLowerCase().indexOf(a.toLowerCase()) !== -1 && list[i].size === size && list[i].price < 10 && list[i].price > 5 && typeplant === list[i].type) {
              filteredList.push(list[i]);
            }
          }
          return filteredList;
        }
      }
    } else {
      return list;
    }
  };
});

app.controller("homeController", function ($scope, $rootScope, $window) {
  $window.scrollTo(0, 0);
  $scope.slickConfig = {
    enabled: true,
    draggable: true,
    infinite: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1008,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    event: {
      beforeChange: function (event, slick, currentSlide, nextSlide) {
        // You can add custom logic here before slide change
      },
      afterChange: function (event, slick, currentSlide, nextSlide) {
        // Remove 'slick-current' class from all slides
        angular.element(".slide").removeClass("slick-current");

        // Add 'slick-current' class to the current slide
        angular.element('.slide[data-slick-index="' + currentSlide + '"]').addClass("slick-current");
      },
    },
  };

  if (!localStorage.getItem("newsletter")) {
    setTimeout(() => {
      const newsletter = document.querySelector(".body--newsletter");
      const overlay = document.querySelector(".body--overlay");

      overlay.style.display = "block";
      newsletter.style.display = "block";
      overlay.style.opacity = 1;
      newsletter.style.opacity = 1;
    }, 2000);
  } else {
    const newsletter = document.querySelector(".body--newsletter");
    const overlay = document.querySelector(".body--overlay");

    overlay.style.display = "none";
    newsletter.style.display = "none";
    overlay.style.opacity = 0;
    newsletter.style.opacity = 0;
  }

  const EMAIL_REGEX = /^\w+@\w+\.\w+$/;

  const closeNewsletter = document.querySelector(".newsletter__close");
  const subscribeButton = document.querySelector(".newsletter-container > button");

  subscribeButton.onclick = function () {
    const email = document.querySelector(".newsletter-container > input");
    if (!EMAIL_REGEX.test(email.value)) {
      alert("wrong");
    } else {
      const newsletter = document.querySelector(".body--newsletter");
      const overlay = document.querySelector(".body--overlay");

      overlay.style.display = "none";
      newsletter.style.display = "none";
      overlay.style.opacity = 0;
      newsletter.style.opacity = 0;

      localStorage.setItem("newsletter", true);
    }
  };

  closeNewsletter.onclick = function () {
    const newsletter = document.querySelector(".body--newsletter");
    const overlay = document.querySelector(".body--overlay");
    const notShow = document.querySelector(".newsletter__dontshow input");

    overlay.style.display = "none";
    newsletter.style.display = "none";
    overlay.style.opacity = 0;
    newsletter.style.opacity = 0;

    if (notShow.checked == true) {
      localStorage.setItem("newsletter", true);
    }
  };
});

app.controller("product", function ($scope, $rootScope, $filter, $window) {
  $window.scrollTo(0, 0);
  const a = document.querySelectorAll("#list__product__type");

  a.forEach((a) => {
    let isVisible = false;

    a.addEventListener("click", (event) => {
      const b = a.querySelectorAll(".product__type");

      b.forEach((b) => {
        if (isVisible) {
          b.style.display = "none";
        } else {
          b.style.display = "block";
        }
      });

      isVisible = !isVisible;

      // Ngăn sự kiện click trên phần tử b lan ra ngoài
      event.stopPropagation();
    });
  });

  // Thêm sự kiện click cho các phần tử b để ngăn lan truyền sự kiện lên phần tử a
  const bElements = document.querySelectorAll(".product__type");
  bElements.forEach((b) => {
    b.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });

  $scope.button_page = true;
  $scope.showsearch = false;
  $scope.showpage = true;
  $scope.showsearch_size = false;
  $scope.page_number = true;
  // $scope.page_number_search_size = false;
  $scope.backgroundcolor = "cornflowerblue";
  $scope.pagenumber = 0;
  $scope.color = "black";
  $scope.confirm_search = false;
  $scope.nextpage = function () {
    if ($rootScope.total_pages_search == 0 || $rootScope.total_pages_search === undefined) {
      if ($rootScope.currentPage < $rootScope.totalPages - 1) {
        $rootScope.currentPage++;
        $scope.pagenumber = $rootScope.currentPage;
      }
    } else {
      if ($rootScope.currentPage < $rootScope.total_pages_search - 1) {
        $rootScope.currentPage++;
        $scope.pagenumber = $rootScope.currentPage;
      }
    }
  };
  $scope.previewpage = function () {
    if ($rootScope.currentPage > 0) {
      $rootScope.currentPage--;
      $scope.pagenumber = $rootScope.currentPage;
    }
  };
  $scope.handleClick = function (event, infor) {
    if (event.which === 3) {
      localStorage.setItem("product", infor.name);
    }
  };
  $scope.getname = function (infor) {
    localStorage.setItem("product", infor.name);
  };

  $scope.click_number = function ($index) {
    $window.scrollTo(0, 0);
    $rootScope.currentPage = $index;
    $scope.pagenumber = $index;
  };
  $scope.setshow_search_or_page = function () {
    $rootScope.input = $scope.input;
    $scope.showresult = false;

    if ($scope.input === "") {
      $scope.showsearch = false;
      $scope.showpage = true;
      $scope.size = undefined;
      $scope.price = undefined;
      $scope.typeplant = undefined;
      $scope.page_number = true;
      $scope.page_number_search = false;

      $scope.showresult = false;
    } else {
      $scope.showsearch = true;
      $scope.showpage = false;

      $scope.page_number = false;
      $scope.page_number_search = true;

      $scope.pagenumber = $rootScope.currentPage = 0;
      $scope.showresult = true;
    }
  };
  $scope.arrange = "ins";

  $scope.getValue = function () {
    $scope.showsearch = true;
    $scope.showpage = false;

    $scope.page_number = false;
    $scope.page_number_search = true;

    $scope.pagenumber = $rootScope.currentPage = 0;
    $scope.showresult = true;
  };

  $scope.$watchGroup(["input", "size", "price", "typeplant", "arrange"], function (newValues, oldValues) {
    var new_input = newValues[0];
    var new_size = newValues[1];
    var new_price = newValues[2];
    var new_typeplant = newValues[3];
    var new_arrange = newValues[4];
    var old_input = oldValues[0];
    var old_size = oldValues[1];
    var old_price = oldValues[2];
    var old_typeplant = oldValues[3];
    var old_arrange = oldValues[4];
    console.log($scope.arrange);
    if (new_input !== old_input || new_size !== old_size || new_price !== old_price || new_typeplant !== old_typeplant || new_arrange !== old_arrange) {
      $rootScope.search_list = $filter("search")($rootScope.list, new_input, new_size, new_price, new_typeplant);
      if (new_arrange === "desc") {
        $rootScope.search_list = $rootScope.search_list.sort((a, b) => a.price - b.price);
        $rootScope.total_pages_search = Math.ceil($rootScope.search_list.length / $rootScope.pagesize);
        $rootScope.pages_search = [];
        for (let i = 0; i < $rootScope.total_pages_search; i++) {
          $rootScope.pages_search[i] = $rootScope.search_list.slice(i * $rootScope.pagesize, (i + 1) * $rootScope.pagesize);
        }
      }
      if (new_arrange === "ins") {
        $rootScope.search_list = $rootScope.search_list.sort((a, b) => b.price - a.price);
        $rootScope.total_pages_search = Math.ceil($rootScope.search_list.length / $rootScope.pagesize);
        $rootScope.pages_search = [];
        for (let i = 0; i < $rootScope.total_pages_search; i++) {
          $rootScope.pages_search[i] = $rootScope.search_list.slice(i * $rootScope.pagesize, (i + 1) * $rootScope.pagesize);
        }
      }
    }
  });
});

app.controller("product_detail", function ($scope, $rootScope, $window) {
  $window.scrollTo(0, 0);
  $rootScope.$watch("product_detail", function (newValue, oldValue) {
    if (newValue && newValue.length > 0) {
      for (let i = 0; i < newValue.length; i++) {
        if (localStorage.getItem("product") === newValue[i].name) {
          $scope.json = newValue[i];
        }
      }
    }
  });

  $scope.addToCart = function () {
    let total = document.querySelector(".number__product").innerHTML;
    let index;

    if ((index = $rootScope.totalCart.findIndex((item) => item[0] == localStorage.getItem("product"))) == -1) {
      $rootScope.totalCart.push([localStorage.getItem("product"), total]);
    } else {
      $rootScope.totalCart[index][1] = +$rootScope.totalCart[index][1] + +total;
    }

    alert("Successfully Added To The Shopping Cart.");

    localStorage.setItem("totalItem", JSON.stringify($rootScope.totalCart));
  };

  const add = document.querySelector(".add__product"),
    sub = document.querySelector(".sub__product"),
    number = document.querySelector(".number__product");

  let a = 1;
  add.addEventListener("click", () => {
    a++;
    a = a < 10 ? "0" + a : a;
    number.innerText = a;
  });

  sub.addEventListener("click", () => {
    if (a > 1) {
      a--;
      a = a < 10 ? "0" + a : a;
      number.innerText = a;
    } else {
      a = 1;
      a = a < 10 ? "0" + a : a;
      number.innerText = a;
    }
  });
});

app.controller("cartController", function ($scope, $rootScope, $window) {
  $window.scrollTo(0, 0);
  $rootScope.$watch("product_detail", function (newValue, oldValue) {
    if (newValue && newValue.length > 0) {
      $scope.tempData = JSON.parse(localStorage.getItem("totalItem"));

      $scope.cartData = [];

      for (let item of $scope.tempData) {
        let product = $rootScope.product_detail.find((itemDetail) => itemDetail.name == item[0]);

        $scope.cartData.push([product.id, product.type, product.img, product.name, item[1], product.price * item[1]]);
      }

      $scope.addQuantity = function (name) {
        let position = $rootScope.totalCart.findIndex((item) => item[0] == name);

        $rootScope.totalCart[position][1] = +$rootScope.totalCart[position][1] + 1;
        localStorage.setItem("totalItem", JSON.stringify($rootScope.totalCart));

        let product = $rootScope.product_detail.find((itemDetail) => itemDetail.name == name);

        let positionSecond = $scope.cartData.findIndex((item) => item[3] == name);

        $scope.cartData[positionSecond][4] = +$scope.cartData[positionSecond][4] + 1;
        $scope.cartData[positionSecond][5] = +$scope.cartData[positionSecond][4] * +product.price;

        $scope.totalBill = 0;
        for (let item of $scope.cartData) {
          $scope.totalBill += +item[5];
        }
      };

      $scope.minusQuantity = function (name) {
        let position = $rootScope.totalCart.findIndex((item) => item[0] == name);
        if ($rootScope.totalCart[position][1] == 1) {
          if (confirm(`You want to remove ${$rootScope.totalCart[position][0]} ?`)) {
            $rootScope.totalCart.splice(position, 1);
            localStorage.setItem("totalItem", JSON.stringify($rootScope.totalCart));

            let positionSecond = $scope.cartData.findIndex((item) => item[3] == name);
            $scope.cartData.splice(positionSecond, 1);

            $scope.totalBill = 0;

            for (let item of $scope.cartData) {
              $scope.totalBill += +item[5];
            }
            return;
          } else {
            return;
          }
        }

        $rootScope.totalCart[position][1] = +$rootScope.totalCart[position][1] - 1;
        localStorage.setItem("totalItem", JSON.stringify($rootScope.totalCart));

        let product = $rootScope.product_detail.find((itemDetail) => itemDetail.name == name);

        let positionSecond = $scope.cartData.findIndex((item) => item[3] == name);

        $scope.cartData[positionSecond][4] = $scope.cartData[positionSecond][4] - 1;
        $scope.cartData[positionSecond][5] = $scope.cartData[positionSecond][4] * product.price;

        $scope.totalBill = 0;

        for (let item of $scope.cartData) {
          $scope.totalBill += +item[5];
        }
      };

      $scope.totalBill = 0;

      for (let item of $scope.cartData) {
        $scope.totalBill += +item[5];
      }
    }
  });
});

app.controller("blog_list", function ($scope, $rootScope, $timeout, $filter, $window) {
  $window.scrollTo(0, 0);
  $scope.button_page = true;
  $scope.showsearch = false;
  $scope.showpage = true;
  $scope.showsearch = false;
  $scope.page_number = true;
  // $scope.page_number_search_size = false;
  $scope.backgroundcolor = "cornflowerblue";
  $scope.pagenumber = 0;
  $scope.color = "black";
  $scope.confirm_search = false;
  $scope.nextpage = function () {
    if ($rootScope.total_pages_search_blog == 0 || $rootScope.total_pages_search_blog === undefined) {
      if ($rootScope.currentPage_blog < $rootScope.totalPages_blog - 1) {
        $rootScope.currentPage_blog++;
        $scope.pagenumber = $rootScope.currentPage_blog;
      }
    } else {
      if ($rootScope.currentPage_blog < $rootScope.total_pages_search_blog - 1) {
        $rootScope.currentPage_blog++;
        $scope.pagenumber = $rootScope.currentPage_blog;
      }
    }
  };
  $scope.previewpage = function () {
    if ($rootScope.currentPage_blog > 0) {
      $rootScope.currentPage_blog--;
      $scope.pagenumber = $rootScope.currentPage_blog;
    }
  };
  $scope.handleClick = function (event, infor) {
    if (event.which === 3) {
      localStorage.setItem("product", infor.name);
    }
  };
  $scope.getname = function (infor) {
    localStorage.setItem("product", infor.name);
  };

  $scope.click_number = function ($index) {
    $rootScope.currentPage_blog = $index;
    $scope.pagenumber = $index;
  };
  $scope.setshow_search_or_page = function () {
    $rootScope.input_blog = $scope.input;
    $scope.showresult = false;

    if ($scope.input === "") {
      $scope.showsearch = false;
      $scope.showpage = true;

      $scope.page_number = true;
      $scope.page_number_search = false;

      $scope.showresult = false;
    } else {
      $scope.showsearch = true;
      $scope.showpage = false;

      $scope.page_number = false;
      $scope.page_number_search = true;

      $scope.pagenumber = $rootScope.currentPage_blog = 0;
      $scope.showresult = true;
    }
  };

  $scope.getValue = function () {
    $scope.showsearch = true;
    $scope.showpage = false;

    $scope.page_number = false;
    $scope.page_number_search = true;

    $scope.pagenumber = $rootScope.currentPage_blog = 0;
    $scope.showresult = true;
  };
  $scope.getname = function (infor) {
    localStorage.setItem("blog", infor.name);
  };
  $scope.$watch("input", function (new_input, old_input) {
    if (new_input != old_input) {
      $rootScope.search_list_blog = $filter("searchBlog")($rootScope.list_blog, new_input);
      $rootScope.total_pages_search_blog = Math.ceil($rootScope.search_list_blog.length / $rootScope.pagesize_blog);
      $rootScope.pages_search_blog = [];
      for (let i = 0; i < $rootScope.total_pages_search_blog; i++) {
        $rootScope.pages_search_blog[i] = $rootScope.search_list_blog.slice(i * $rootScope.pagesize_blog, (i + 1) * $rootScope.pagesize_blog);
      }
    }
  });
});

app.controller("blog-infor", function ($scope, $rootScope, $sce, $window) {
  $window.scrollTo(0, 0);
  $rootScope.$watch("ds", function (newValue, oldValue) {
    if (newValue && newValue.length > 0) {
      for (let i = 0; i < newValue.length; i++) {
        if (localStorage.getItem("blog") === newValue[i].name) {
          $scope.json = newValue[i];
          $scope.p1 = $sce.trustAsHtml($scope.json.p1);
          $scope.p2 = $sce.trustAsHtml($scope.json.p2);
          $scope.p3 = $sce.trustAsHtml($scope.json.p3);
          $scope.p4 = $sce.trustAsHtml($scope.json.p4);
          $scope.p5 = $sce.trustAsHtml($scope.json.p5);
          $scope.p6 = $sce.trustAsHtml($scope.json.p6);
        }
      }
    }
  });
});

app.controller("formPayController", function ($scope, $rootScope, $window) {
  $window.scrollTo(0, 0);
  function sNotification() {
    let checkedPayment = document.getElementById("payment");

    if (checkedPayment.checked) {
      alert("Successful transaction!");
      return true;
    } else {
      alert("Error: Select a payment method ?");
      event.preventDefault();
      return false;
    }
  }
});

app.controller("feedbackController", function ($scope, $rootScope, $window) {
  $window.scrollTo(0, 0);
  $scope.receiveFeedback = function () {
    alert("Thank you for your feedback");
    $window;
  };
});

//*********************************************** */

//************************************************ */
