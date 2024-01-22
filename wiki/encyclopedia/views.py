from django.shortcuts import render, redirect
from django.http import HttpResponse
from . import util
from .util import get_entry, list_entries
import markdown2

def index(request):
    #util.list_entries could also be assigned as a variable outside of context (entry = list_entries())
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })
#this a change in the file to commit

def entry_page(request, title):
    entry_content = get_entry(title)
    if entry_content:
        # Convert Markdown to HTML using markdown2
        html_content = markdown2.markdown(entry_content)
        return render(request, "encyclopedia/wiki.html", {"title": title, "entry_content": html_content})
    else:
        return HttpResponse("Entry Not Found", status=404)
    
def search(request):
    search_query = request.GET.get('q', '')
    page_content = get_entry(search_query)
    entries = list_entries()
    partial_match = [entry for entry in entries if search_query.lower() in entry.lower()]
    if page_content:
        return redirect("entry_page", title=search_query)
    else:
        return render(request, 'encyclopedia/search.html', {"partial_match": partial_match, "search_query": search_query})
    
def create(request):
    return render(request, 'encyclopedia/create.html')