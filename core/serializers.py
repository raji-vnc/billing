from rest_framework import serializers
from .models import Product,Customer,Invoice,InvoiceItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'

class CustomerItemSerializer(serializers.ModelSerializer):

    class Meta:
        model=Customer
        fields=['id','name','email','phone','address','created_at']

class InvoiceItemSerializer(serializers.ModelSerializer):
    product_detail=ProductSerializer(source='product',read_only=True)

    class Meta:
        model=InvoiceItem
        fields=['id','product','product_detail','description','quantity','unit_price','line_total']

class InvoiceSerializer(serializers.ModelSerializer):
    items=InvoiceItemSerializer(many=True)
    customer_detail=CustomerItemSerializer(source='customer',read_only=True)

    class Meta:
        model=Invoice
        fields=['id','customer','customer_detail','date','status','note','items','total']
    
    def create(self, validated_data):
        items_data=validated_data.pop('items')
        invoice=Invoice.objects.create(**validated_data)
        for item in items_data:
            InvoiceItem.objects.create(
                invoice=invoice,

                product=item['product'],
                description=item.get('description',''),
                quantity=item.get('quantity',1),
                unit_price=item.get('unit_price'),
            )
            invoice.calculate_totals()
            return invoice
    
    def update(self,instance,validate_data):
        items_data=validate_data.pop('items',None)
        instance.customer=validate_data.get('customer',instance.customer)
        instance.status=validate_data.get('status',instance.status)
        instance.note=validate_data.get('note',instance.note)
        instance.save()


        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                InvoiceItem.objects.create(
                    invoice=instance,
                    product=item['product'],
                    description=item.get('description',''),
                    quantity=item.get('quantity',1),
                    unit_price=item.get('unit_price'),
                )
            instance.calculate_totals()
        return instance