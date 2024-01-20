from django.shortcuts import render
from django.http import HttpResponse
from . import util
from .util import get_entry, list_entries
import markdown2

def index(request):
    #util.list_entries could also be assigned as a variable outside of context (entry = list_entries())
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry_page(request, title):
    entry_content = get_entry(title)
    if entry_content:
        # Convert Markdown to HTML using markdown2
        html_content = markdown2.markdown(entry_content)
        return render(request, "encyclopedia/wiki.html", {"title": title, "entry_content": html_content})
    else:
        return HttpResponse("Entry Not Found", status=404)