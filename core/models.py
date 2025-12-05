from django.db import models

class Product(models.Model):
    name=models.CharField(max_length=200)
    sku=models.CharField(max_length=100,blank=True,null=True,unique=True)
    descripition=models.TextField(blank=True)
    price=models.DecimalField(max_digits=12,decimal_places=2)
    tax_percent=models.DecimalField(max_digits=5,decimal_places=2,default=0)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Customer(models.Model):
    name=models.CharField(max_length=200)
    email=models.EmailField(blank=True,null=True)
    phone=models.CharField(max_length=20,blank=True)
    address=models.TextField(blank=True)
    created_at=models.DateField(auto_now_add=True)


    def __str__(self):
        return self.name
class Invoice(models.Model):
    STATUS_CHOICE=(
        ('draft',"Draft"),
        ('sent',"Sent"),
        ('partial',"Partial"),
        ('paid','Paid'),
        ('cancelled',"Cancelled"),
    )
    customer=models.ForeignKey(Customer,on_delete=models.CASCADE,related_name='invoices')
    date=models.DateTimeField(auto_now_add=True)
    status=models.CharField(max_length=20,choices=STATUS_CHOICE,default='draft')
    note=models.TextField(blank=True)
    total=models.DecimalField(max_digits=12,decimal_places=2,default=0)
    
    def __str__(self):
        return f"invoice #{self.id} - {self.customer.name}"
    
    def calculate_totals(self):
        items=self.items.all()
        subtotal=sum([item.line_total for item in items])
        self.total=subtotal
        self.save()

class InvoiceItem(models.Model):
    invoice=models.ForeignKey(Invoice,on_delete=models.CASCADE,related_name='items')
    product=models.ForeignKey(Product,on_delete=models.PROTECT)
    description=models.CharField(max_length=255,blank=True)
    quantity=models.PositiveIntegerField(default=1)
    unit_price=models.DecimalField(max_digits=12,decimal_places=2)
    line_total=models.DecimalField(max_digits=12,decimal_places=2,default=0)

    def save(self,*args,**kwargs):
        self.line_total=self.quantity * self.unit_price
        return super().save(*args,**kwargs)
    
    def __str__(self):
        return f'{self.product.name} X {self.quantity}'