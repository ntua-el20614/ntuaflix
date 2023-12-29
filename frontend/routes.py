from flask import Flask, render_template, request, flash, redirect, url_for, abort, jsonify
from flask_mysqldb import MySQL
from frontend import app, db  # initially created by __init__.py, need to be used here
import requests

@app.route("/")
def index():
    return render_template("landing.html", pageTitle="Login Page")

