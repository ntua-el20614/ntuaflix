from flask import Flask, render_template, request, flash, redirect, url_for, abort, jsonify
from flask_mysqldb import MySQL
from frontend import app, db  # initially created by __init__.py, need to be used here
import requests

@app.route("/")
def index():
    return render_template("landing.html", pageTitle="Login Page")


@app.route("/moviepage")
def movie():
    return render_template("moviepage.html", pageTitle="Movie Page")



@app.route("/seriespage")
def series():
    return render_template("seriespage.html", pageTitle="Series Page")


@app.route("/personpage")
def person():
    return render_template("personpage.html", pageTitle="Person Page")



@app.route("/adminpage")
def admin():
    return render_template("admin.html", pageTitle="Person Page")


@app.route("/login")
def login():
    return render_template("login/login.html", pageTitle="Person Page")


@app.route("/signup")
def signup():
    return render_template("login/signup.html", pageTitle="Person Page")

