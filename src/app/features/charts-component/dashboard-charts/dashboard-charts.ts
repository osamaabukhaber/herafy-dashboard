import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgApexchartsModule,
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexLegend,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexFill,
  ApexStroke
} from "ng-apexcharts";
import { UserService } from '../../../services/user-services/user.service';
import { CouponService } from '../../../services/coupon-service/coupon-service';
import { ProductApiService } from '../../products/services/product-api.service';
import { StoreServices } from '../../store/services/store-serivces/store-services';
import { ReviewService } from '../../../services/review-services/review-services';
import { IUser } from '../../../models/iuser';
import { ICoupon } from '../../../shared/models/coupon.interface';
import { Product } from '../../../shared/models/product.interface';
import { IStore } from '../../../models/store-model/istore';
import { Review, ReviewApiResponse } from '../../../shared/models/review.interface';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
};

export type ColumnChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
};

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  stroke: ApexStroke;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="space-y-4 p-2 sm:p-4 lg:p-6">
      <!-- Product Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        <div class="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-xs sm:text-sm">Total Products</p>
              <p class="text-xl sm:text-3xl font-bold">{{ productStats.total }}</p>
            </div>
            <div class="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-xs sm:text-sm">Number of Stores</p>
              <p class="text-xl sm:text-3xl font-bold">{{ productStats.totalStores }}</p>
            </div>
            <div class="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-100 text-xs sm:text-sm">Number of Users</p>
              <p class="text-xl sm:text-3xl font-bold">{{ productStats.totalUsers }}</p>
            </div>
            <div class="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-xs sm:text-sm">Total Coupons</p>
              <p class="text-xl sm:text-3xl font-bold">{{ productStats.totalCoupons }}</p>
            </div>
            <div class="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M17 5H3a1 1 0 00-1 1v3a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1zM3 3a3 3 0 00-3 3v8a3 3 0 003 3h14a3 3 0 003-3V6a3 3 0 00-3-3H3zm2 11a1 1 0 011-1h3a1 1 0 110 2H6a1 1 0 01-1-1zm6 0a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-indigo-100 text-xs sm:text-sm">Total Reviews</p>
              <p class="text-xl sm:text-3xl font-bold">{{ productStats.totalReviews }}</p>
              <p class="text-indigo-200 text-xs mt-1">Avg: {{ productStats.averageRating | number:'1.1-1' }}/5</p>
            </div>
            <div class="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <!-- Users Pie Chart -->
        <div class="p-3 sm:p-4 bg-white rounded-xl shadow-md">
          <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Users by Role</h2>
          <apx-chart
            *ngIf="userChartOptions"
            [series]="userChartOptions.series"
            [chart]="userChartOptions.chart"
            [labels]="userChartOptions.labels"
            [responsive]="userChartOptions.responsive"
            [legend]="userChartOptions.legend"
          ></apx-chart>
        </div>

        <!-- Coupons Donut Chart -->
        <div class="p-3 sm:p-4 bg-white rounded-xl shadow-md">
          <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Coupon Status Distribution</h2>
          <apx-chart
            *ngIf="couponChartOptions"
            [series]="couponChartOptions.series"
            [chart]="couponChartOptions.chart"
            [labels]="couponChartOptions.labels"
            [responsive]="couponChartOptions.responsive"
            [legend]="couponChartOptions.legend"
          ></apx-chart>
        </div>

        <!-- Reviews Rating Chart -->
        <div class="p-3 sm:p-4 bg-white rounded-xl shadow-md">
          <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Review Ratings Distribution</h2>
          <apx-chart
            *ngIf="reviewChartOptions"
            [series]="reviewChartOptions.series"
            [chart]="reviewChartOptions.chart"
            [labels]="reviewChartOptions.labels"
            [responsive]="reviewChartOptions.responsive"
            [legend]="reviewChartOptions.legend"
          ></apx-chart>
        </div>

        <!-- Products Column Chart -->
        <div class="p-3 sm:p-4 bg-white rounded-xl shadow-md">
          <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Products by Price Range</h2>
          <apx-chart
            *ngIf="productChartOptions"
            [series]="productChartOptions.series"
            [chart]="productChartOptions.chart"
            [xaxis]="productChartOptions.xaxis"
            [yaxis]="productChartOptions.yaxis"
            [dataLabels]="productChartOptions.dataLabels"
            [plotOptions]="productChartOptions.plotOptions"
            [responsive]="productChartOptions.responsive"
          ></apx-chart>
        </div>

        <!-- Stores Area Chart -->
        <div class="p-3 sm:p-4 bg-white rounded-xl shadow-md">
          <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Stores by Status</h2>
          <apx-chart
            *ngIf="storeChartOptions"
            [series]="storeChartOptions.series"
            [chart]="storeChartOptions.chart"
            [xaxis]="storeChartOptions.xaxis"
            [yaxis]="storeChartOptions.yaxis"
            [dataLabels]="storeChartOptions.dataLabels"
            [fill]="storeChartOptions.fill"
            [stroke]="storeChartOptions.stroke"
            [responsive]="storeChartOptions.responsive"
          ></apx-chart>
        </div>


      </div>
    </div>
  `
})
export class DashboardChartsComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;

  // Product statistics for cards
  public productStats = {
    total: 0,
    totalStores: 0,
    totalUsers: 0,
    totalCoupons: 0,
    totalReviews: 0,
    averageRating: 0
  };

  public userChartOptions: ChartOptions = {
    series: [0, 0, 0],
    chart: { type: "pie", width: '100%', height: 350 },
    labels: ["Admins", "Customers", "Vendors"],
    responsive: [
      { 
        breakpoint: 640, 
        options: { 
          chart: { width: '100%', height: 280 }, 
          legend: { position: "bottom" } 
        } 
      },
      { 
        breakpoint: 1024, 
        options: { 
          chart: { width: '100%', height: 320 }, 
          legend: { position: "right" } 
        } 
      }
    ],
    legend: { position: "right" }
  };

  public couponChartOptions: ChartOptions = {
    series: [0, 0, 0],
    chart: { type: "donut", width: '100%', height: 350 },
    labels: ["Active", "Inactive", "Expired"],
    responsive: [
      { 
        breakpoint: 640, 
        options: { 
          chart: { width: '100%', height: 280 }, 
          legend: { position: "bottom" } 
        } 
      },
      { 
        breakpoint: 1024, 
        options: { 
          chart: { width: '100%', height: 320 }, 
          legend: { position: "right" } 
        } 
      }
    ],
    legend: { position: "right" }
  };

  public reviewChartOptions: ChartOptions = {
    series: [0, 0, 0, 0, 0],
    chart: { type: "polarArea", width: '100%', height: 350 },
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    responsive: [
      { 
        breakpoint: 640, 
        options: { 
          chart: { width: '100%', height: 280 }, 
          legend: { position: "bottom" } 
        } 
      },
      { 
        breakpoint: 1024, 
        options: { 
          chart: { width: '100%', height: 320 }, 
          legend: { position: "right" } 
        } 
      }
    ],
    legend: { position: "right" }
  };

  public productChartOptions: ColumnChartOptions = {
    series: [{
      name: 'Products',
      data: [0, 0, 0, 0]
    }],
    chart: { 
      type: "bar", 
      width: '100%',
      height: 350,
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ["Budget\n(≤$50)", "Mid-range\n($51-$200)", "Premium\n($201-$500)", "Luxury\n(>$500)"],
      labels: {
        style: {
          fontSize: '11px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Products'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        distributed: true
      }
    },
    responsive: [
      { 
        breakpoint: 640, 
        options: { 
          chart: { width: '100%', height: 280 },
          xaxis: {
            labels: {
              style: {
                fontSize: '9px'
              }
            }
          },
          dataLabels: {
            style: {
              fontSize: '10px'
            }
          }
        } 
      },
      { 
        breakpoint: 1024, 
        options: { 
          chart: { width: '100%', height: 320 },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        } 
      }
    ]
  };

  public storeChartOptions: AreaChartOptions = {
    series: [{
      name: 'Stores',
      data: [0, 0, 0]
    }],
    chart: {
      type: 'area',
      width: '100%',
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    xaxis: {
      categories: ['Active', 'Pending', 'Inactive']
    },
    yaxis: {
      title: {
        text: 'Number of Stores'
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: '100%',
            height: 280
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      },
      {
        breakpoint: 1024,
        options: {
          chart: {
            width: '100%',
            height: 320
          }
        }
      }
    ]
  };

  public reviewEntityChartOptions: ColumnChartOptions = {
    series: [{
      name: 'Reviews',
      data: [0, 0],
      color: '#8B5CF6'
    }],
    chart: { 
      type: "bar", 
      width: '100%',
      height: 350,
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ["Product Reviews", "Store Reviews"],
      labels: {
        style: {
          fontSize: '11px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Number of Reviews'
      },
      min: 0
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
        distributed: false
      }
    },
    responsive: [
      { 
        breakpoint: 640, 
        options: { 
          chart: { width: '100%', height: 280 },
          xaxis: {
            labels: {
              style: {
                fontSize: '9px'
              }
            }
          },
          dataLabels: {
            style: {
              fontSize: '10px'
            }
          }
        } 
      },
      { 
        breakpoint: 1024, 
        options: { 
          chart: { width: '100%', height: 320 },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        } 
      }
    ]
  };

  constructor(
    private userService: UserService,
    private couponService: CouponService,
    private productApiService: ProductApiService,
    private storeApiService: StoreServices,
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadCouponData();
    this.loadProductData();
    this.loadStoreData();
    this.loadReviewData();
  }

  private loadUserData(): void {
    let allUsers: IUser[] = [];
    let currentPage = 1;
    const limit = 50;

    const fetchPage = () => {
      this.userService.getAllUsers(currentPage, limit).subscribe((res) => {
        const users: IUser[] = res.data.users || [];
        allUsers = [...allUsers, ...users];

        if (users.length === limit) {
          currentPage++;
          fetchPage();
        } else {
          const roleCounts = { admin: 0, customer: 0, vendor: 0 };
          allUsers.forEach(u => {
            if (u.role) {
              const role = u.role.toLowerCase();
              if (roleCounts.hasOwnProperty(role)) roleCounts[role as keyof typeof roleCounts]++;
            }
          });

          this.userChartOptions.series = [
            roleCounts.admin,
            roleCounts.customer,
            roleCounts.vendor
          ];
          this.productStats.totalUsers = allUsers.length;
          this.cdr.markForCheck();
        }
      });
    };

    fetchPage();
  }

  private loadCouponData(): void {
    let allCoupons: ICoupon[] = [];
    let currentPage = 1;
    const limit = 50;

    const fetchPage = () => {
      this.couponService.getAllCupons(currentPage, limit).subscribe(res => {
        const coupons: ICoupon[] = res.data.allCupons || [];
        allCoupons = [...allCoupons, ...coupons];

        if (coupons.length === limit) {
          currentPage++;
          fetchPage();
        } else {
          const now = new Date();
          let active = 0, inactive = 0, expired = 0;

          allCoupons.forEach(c => {
            if (c.isDeleted) {
              return;
            }
            
            if (new Date(c.expiryDate) < now) {
              expired++;
            } else if (c.active) {
              active++;
            } else {
              inactive++;
            }
          });

          this.couponChartOptions.series = [active, inactive, expired];
          this.productStats.totalCoupons = allCoupons.filter(c => !c.isDeleted).length;
          this.cdr.markForCheck();
        }
      });
    };

    fetchPage();
  }

  private loadProductData(): void {
    this.productApiService.getProducts().subscribe({
      next: (res) => {
        const products: Product[] = res.products || [];
        
        const activeProducts = products.filter(p => !p.isDeleted);
        
        this.productStats.total = activeProducts.length;
        
        let budget = 0;
        let midRange = 0;
        let premium = 0;
        let luxury = 0;

        activeProducts.forEach(product => {
          const price = product.discountPrice && product.discountPrice > 0 
            ? product.discountPrice 
            : product.basePrice;

          if (price <= 50) {
            budget++;
          } else if (price <= 200) {
            midRange++;
          } else if (price <= 500) {
            premium++;
          } else {
            luxury++;
          }
        });

        this.productChartOptions.series = [{
          name: 'Products',
          data: [budget, midRange, premium, luxury]
        }];
        
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load products:', error);
      }
    });
  }

  private loadStoreData(): void {
    this.storeApiService.getAllStores().subscribe({
      next: (res) => {
        const stores: IStore[] = res.data.stores || [];
        
        const activeStores = stores.filter(s => !s.isDeleted && s.status.toLowerCase() === 'active').length;
        const pendingStores = stores.filter(s => !s.isDeleted && s.status.toLowerCase() === 'pending').length;
        const inactiveStores = stores.filter(s => !s.isDeleted && s.status.toLowerCase() === 'inactive').length;
        const totalStores = stores.filter(s => !s.isDeleted).length;

        this.storeChartOptions.series = [{
          name: 'Stores',
          data: [activeStores, pendingStores, inactiveStores]
        }];
        this.productStats.totalStores = totalStores;
        
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load stores:', error);
      }
    });
  }

  private loadReviewData(): void {
    let allReviews: Review[] = [];
    let currentPage = 1;
    const limit = 50;

    const fetchPage = () => {
      console.log(`🔄 Fetching reviews page ${currentPage}...`);
      
      this.reviewService.getAllReviews(currentPage.toString(), limit.toString()).subscribe({
        next: (res: ReviewApiResponse) => {
          console.log('📊 Review API Response:', res);
          
          const reviews: Review[] = res.data?.allReviews || [];
          console.log(`📄 Fetched ${reviews.length} reviews on page ${currentPage}`);
          
          allReviews = [...allReviews, ...reviews];

          if (reviews.length === limit) {
            currentPage++;
            fetchPage();
          } else {
            console.log(`✅ Total reviews loaded: ${allReviews.length}`);
            console.log('📝 Sample reviews:', allReviews.slice(0, 3));
            
            // Process rating distribution
            const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            let totalRating = 0;

            allReviews.forEach(review => {
              const rating = review.rating;
              if (rating >= 1 && rating <= 5) {
                ratingCounts[rating as keyof typeof ratingCounts]++;
                totalRating += rating;
              }
            });

            console.log('⭐ Rating distribution:', ratingCounts);

            this.reviewChartOptions.series = [
              ratingCounts[1],
              ratingCounts[2],
              ratingCounts[3],
              ratingCounts[4],
              ratingCounts[5]
            ];

            // Process user review distribution - but simplified without the complex logic
            this.productStats.totalReviews = allReviews.length;
            this.productStats.averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
            
            console.log('📊 Final chart data - Ratings:', this.reviewChartOptions.series);
            console.log('📈 Stats updated:', this.productStats);
            
            this.cdr.markForCheck();
          }
        },
        error: (error) => {
          console.error('❌ Failed to load reviews:', error);
          
          // Set default values to show empty charts
          this.reviewChartOptions.series = [0, 0, 0, 0, 0];
          this.reviewEntityChartOptions.series = [{
            name: 'Reviews',
            data: [0, 0]
          }];
          this.productStats.totalReviews = 0;
          this.productStats.averageRating = 0;
          
          this.cdr.markForCheck();
        }
      });
    };

    fetchPage();
  }
}