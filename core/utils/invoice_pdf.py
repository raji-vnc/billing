from django.template.loader import render_to_string
try:
    from weasyprint import HTML
except Exception:
    HTML=None

def render_invoice_pdf(invoice):
    context={
        'invoice':invoice,
        'items':invoice.items.all(),
    }

    html_string=render_to_string('invoice.html',context)

    if  HTML is None:
        return None


    pdf=HTML(string=html_string).write_pdf()
    return pdf