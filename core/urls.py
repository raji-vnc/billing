from django.urls import path,include
from core import views
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet,CustomerViewset,InvoiceViewSet,InvoicePDFView




router=DefaultRouter()
router.register(r'products',ProductViewSet,basename='product')
router.register(r'customers',CustomerViewset,basename='customer')
router.register(r'invoices',InvoiceViewSet,basename='invoice')

urlpatterns=[
    path("",include(router.urls)),
    path("invoices/<int:pk>/pdf/", InvoicePDFView.as_view(), name="invoice-pdf"),


] 
