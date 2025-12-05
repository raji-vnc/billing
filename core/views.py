from django.shortcuts import render
from rest_framework import viewsets,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product,Customer,Invoice
from .serializers import ProductSerializer,CustomerItemSerializer,InvoiceSerializer
from core.utils.invoice_pdf import render_invoice_pdf
from rest_framework.decorators import api_view
from django.template.loader import render_to_string
from django.template.loader import get_template
from django.http import HttpResponse
from django.views.generic import View
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from weasyprint import HTML,CSS
from weasyprint.text.fonts import FontConfiguration


@api_view(["GET"])
def product_list(request):
    data=[
        {"id":1,"name":"laptop","price":5000 },
        {"id":2,"name":"Mouse","price":500},
    ]
    return Response(data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset=Product.objects.all().order_by('-id')
    serializer_class=ProductSerializer
    permission_classes=[IsAuthenticated]

class CustomerViewset(viewsets.ModelViewSet):
    queryset=Customer.objects.all().order_by('-id')
    serializer_class=CustomerItemSerializer
    permission_classes=[IsAuthenticated]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset=Invoice.objects.all().order_by('-id')
    serializer_class=InvoiceSerializer
    permission_classes=[IsAuthenticated]

    @action(detail=True,methods=['get'])
    def pdf(self,request,pk=None):
        invoice=self.get_object()
        html_string=render_to_string("invoice_pdf.html",{"invoice":invoice})
        html=HTML(string=html_string)
        pdf=html.write_pdf()
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename=invoice_{invoice.id}.pdf'
        return response



class InvoicePDFView(View):
    def get(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            return HttpResponse("Invoice not found", status=404)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.id}.pdf"'

        pdf = canvas.Canvas(response, pagesize=A4)
        width, height = A4
        y = height - 50

        pdf.setFont("Helvetica-Bold", 18)
        pdf.drawString(50, y, f"Invoice #{invoice.id}")
        y -= 30

        pdf.setFont("Helvetica", 12)
        pdf.drawString(50, y, f"Customer: {invoice.customer.name if invoice.customer else ''}")
        y -= 20
        pdf.drawString(50, y, f"Date: {invoice.date}")
        y -= 30

        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, "Items")
        y -= 20

        pdf.setFont("Helvetica", 11)
        for item in invoice.items.all():
            line = (
                f"{item.product.name} | Qty: {item.quantity} | Price: {item.unit_price} | "
                f"Total: {item.line_total}"
            )
            pdf.drawString(50, y, line)
            y -= 20

            if y < 60:  # new page if table is long
                pdf.showPage()
                pdf.setFont("Helvetica", 11)
                y = height - 50

        y -= 30
        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(50, y, f"Grand Total: {invoice.total}")

        pdf.save()
        return response

