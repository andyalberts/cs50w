from django.shortcuts import render
y
tasks= ["foo", "bar", "baz"]
# Create your views here.
def index(request):
    return render(request, "tasks/index.html", {
        "tasks": tasks
    })