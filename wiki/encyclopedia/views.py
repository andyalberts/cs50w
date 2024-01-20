from django.shortcuts import render
from django.http import HttpResponse
from . import util
from .util import get_entry


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry_page(request, title):
    entry_content = get_entry(title)
    if entry_content:
        return render(request, "encyclopedia/wiki.html", {"title": title, "entry_content": entry_content})
    else:
        return HttpResponse("Entry Not Found", status=404)