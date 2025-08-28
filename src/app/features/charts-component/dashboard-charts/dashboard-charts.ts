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
import { IUser } from '../../../models/iuser';
import { ICoupon } from '../../../shared/models/coupon.interface';
import { Product } from '../../../shared/models/product.interface';
import { IStore } from '../../../models/store-model/istore';

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
    <div class="space-y-6 p-4">
      <!-- Product Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">Total Products</p>
              <p class="text-3xl font-bold">{{ productStats.total }}</p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-full">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">Number of Stores</p>
              <p class="text-3xl font-bold">{{ productStats.totalStores }}</p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-full">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-100 text-sm">Number of Users</p>
              <p class="text-3xl font-bold">{{ productStats.totalUsers }}</p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-full">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm">Total Coupons</p>
              <p class="text-3xl font-bold">{{ productStats.totalCoupons }}</p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-full">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M17 5H3a1 1 0 00-1 1v3a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1zM3 3a3 3 0 00-3 3v8a3 3 0 003 3h14a3 3 0 003-3V6a3 3 0 00-3-3H3zm2 11a1 1 0 011-1h3a1 1 0 110 2H6a1 1 0 01-1-1zm6 0a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Users Pie Chart -->
        <div class="p-4 bg-white rounded-xl shadow-md">
          <h2 class="text-xl font-bold mb-4">Users by Role</h2>
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
        <div class="p-4 bg-white rounded-xl shadow-md">
          <h2 class="text-xl font-bold mb-4">Coupon Status Distribution</h2>
          <apx-chart
            *ngIf="couponChartOptions"
            [series]="couponChartOptions.series"
            [chart]="couponChartOptions.chart"
            [labels]="couponChartOptions.labels"
            [responsive]="couponChartOptions.responsive"
            [legend]="couponChartOptions.legend"
          ></apx-chart>
        </div>

        <!-- Products Column Chart -->
        <div class="p-4 bg-white rounded-xl shadow-md">
          <h2 class="text-xl font-bold mb-4">Products by Price Range</h2>
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
        <div class="p-4 bg-white rounded-xl shadow-md">
          <h2 class="text-xl font-bold mb-4">Stores by Status</h2>
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
    totalCoupons: 0
  };

  public userChartOptions: ChartOptions = {
    series: [0, 0, 0],
    chart: { type: "pie", width: 400 },
    labels: ["Admins", "Customers", "Vendors"],
    responsive: [
      { breakpoint: 480, options: { chart: { width: 300 }, legend: { position: "bottom" } } }
    ],
    legend: { position: "right" }
  };

  public couponChartOptions: ChartOptions = {
    series: [0, 0, 0],
    chart: { type: "donut", width: 400 },
    labels: ["Active", "Inactive", "Expired"],
    responsive: [
      { breakpoint: 480, options: { chart: { width: 300 }, legend: { position: "bottom" } } }
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
      width: 400,
      height: 350,
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ["Budget\n(≤$50)", "Mid-range\n($51-$200)", "Premium\n($201-$500)", "Luxury\n(>$500)"]
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
        breakpoint: 480, 
        options: { 
          chart: { width: 300, height: 300 },
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
      width: 400,
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
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
            height: 300
          },
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadCouponData();
    this.loadProductData();
    this.loadStoreData();
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
}