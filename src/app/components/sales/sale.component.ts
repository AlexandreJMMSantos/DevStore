import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';

interface Sale {
  saleNumber: string;
  saleDate: string;
  customer: string;
  branch: string;
  totalAmount: number;
  cancelled: boolean;
  products: any[];
}

@Component({
  selector: 'app-sales',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SalesComponent implements OnInit {
  salesData: Sale[] = [];
  currentPage = 1;
  pageSize = 5;
  editingSale: Sale | null = null;

  constructor(private saleService: SaleService) { }

  ngOnInit() {
    this.fetchSales();
  }

  fetchSales() {
    this.saleService.getSales().subscribe(response => {
      console.log(response.data);
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      this.salesData = this.groupSales(data);
    });
  }

  groupSales(data: any[]): Sale[] {
    const grouped: { [key: string]: Sale } = {};

    data.forEach(sale => {
      if (!grouped[sale.saleNumber]) {
        grouped[sale.saleNumber] = {
          saleNumber: sale.saleNumber,
          saleDate: sale.saleDate,
          customer: sale.userId, 
          branch: sale.chartId, 
          totalAmount: 0,
          cancelled: sale.isCancelled, 
          products: []
        };
      }

      const saleTotal = sale.totalAmount ? parseFloat(sale.totalAmount) : 0;
      grouped[sale.saleNumber].totalAmount += saleTotal;

      grouped[sale.saleNumber].products.push({
        productId: sale.productId,
        quantity: sale.quantity,
        unitPrice: sale.unitPrice,
        discount: sale.discount,
        totalItemAmount: saleTotal 
      });
    });

    return Object.values(grouped);
  }
  

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.salesData.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  editSale(sale: Sale) {
    this.editingSale = { ...sale };
  }

  saveEdit() {
    if (this.editingSale) {
      const index = this.salesData.findIndex(s => s.saleNumber === this.editingSale?.saleNumber);
      if (index !== -1) {
        this.salesData[index] = { ...this.editingSale };
      }
      this.editingSale = null;
    }
  }

  cancelEdit() {
    this.editingSale = null;
  }
}
