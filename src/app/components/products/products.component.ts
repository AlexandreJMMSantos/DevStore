import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  cart: Product[] = [];
  showCart = false;

  constructor(private productService: ProductService, private saleService: SaleService) { }

  ngOnInit(): void {
    this.loadProducts();

    const userData = sessionStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      console.log('Usuário logado:', user);
    }
  }

  loadProducts(): void {
    this.productService.getAll().subscribe(response => {
      console.log('API Response:', response);

      if (response?.data?.data) {
        this.products = response.data.data.map(product => ({
          ...product,
          quantity: 0 
        }));
      } else {
        console.error('Estrutura inesperada da API:', response);
        this.products = [];
      }
    }, error => {
      console.error('Erro ao carregar produtos:', error);
      this.products = [];
    });
  }

  increaseQuantity(product: Product) {
    if (product.quantity! < 20) {
      product.quantity!++;
      this.updateCart(product);
    } else {
      alert("O máximo permitido para esse item é 20 unidades.");
    }
  }

  decreaseQuantity(product: Product) {
    if (product.quantity! > 0) {
      product.quantity!--;
      this.updateCart(product);
    }
  }

  updateCart(product: Product) {
    const index = this.cart.findIndex(item => item.id === product.id);
    if (product.quantity! > 0) {
      if (index === -1) {
        this.cart.push(product);
      } else {
        this.cart[index] = product;
      }
    } else {
      this.cart.splice(index, 1);
    }
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  showCartSummary() {
    if (this.cart.length === 0) {
      alert("O carrinho está vazio.");
      return;
    }

    let summary = "Resumo do Carrinho:\n";
    this.cart.forEach(item => {
      let quantity = item.quantity!;
      let discount = 0;

      if (quantity > 20) {
        quantity = 20;
      }

      if (quantity >= 10 && quantity <= 20) {
        discount = 0.2;
      } else if (quantity > 4) {
        discount = 0.1;
      }

      let totalItem = quantity * item.price * (1 - discount);
      summary += `${item.title} - ${quantity}x - R$ ${totalItem.toFixed(2)} (Desconto: ${(discount * 100)}%)\n`;
    });

    summary += `\nTotal: R$ ${this.getCartTotal().toFixed(2)}`;
    alert(summary);
  }


  getCartTotal(): number {
    return this.cart.reduce((total, item) => {
      let quantity = item.quantity!;

      if (quantity > 20) {
        quantity = 20;
      }

      let discount = 0;
      if (quantity >= 10 && quantity <= 20) {
        discount = 0.2; 
      } else if (quantity > 4) {
        discount = 0.1; 
      }

      const itemTotal = quantity * item.price * (1 - discount);
      return total + itemTotal;
    }, 0);
  }

  confirm() {
    const userString = sessionStorage.getItem('user');

    if (!userString) {
      alert('Usuário não autenticado!');
      return;
    }

    try {
      const userObject = JSON.parse(userString);

      if (!userObject.data || !userObject.data.id) {
        alert('Usuário inválido!');
        return;
      }

      const user = userObject.data;
      console.log('Usuário autenticado:', user);

      let errors = 0;

      var saleNumberGenerated = `SALE-${Math.floor(Math.random() * 100000)}`;
      var chartIdGenerated = crypto.randomUUID();

      this.cart.forEach((product) => {
        const sale = {
          saleNumber: saleNumberGenerated,
          chartId: chartIdGenerated,
          userId: user.id,
          productId: product.id,
          quantity: product.quantity,
          unitPrice: product.price,
          discount: this.calculateDiscount(product.quantity, product.price),
          isCancelled: false,
          saleDate: new Date().toISOString()
        };

        this.saleService.createSale(sale).subscribe(
          () => {
            console.log(`Venda do produto ${product.title} confirmada!`);
          },
          (error) => {
            console.error(`Erro ao confirmar a venda do produto ${product.title}:`, error);
            errors++;
          }
        );
      });

      if (errors === 0) {
        alert('Todas as vendas foram processadas com sucesso!');
        this.cart = [];
      } else {
        alert('Houve erros ao processar algumas vendas.');
      }

    } catch (error) {
      console.error('Erro ao processar os dados do usuário:', error);
      alert('Erro ao recuperar o usuário!');
    }
  }



  calculateDiscount(quantity: number, price: number): number {
    if (quantity >= 10 && quantity <= 20) return price * quantity * 0.2;
    if (quantity > 4) return price * quantity * 0.1;
    return 0;
  }
}
