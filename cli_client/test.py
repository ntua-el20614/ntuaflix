#!/usr/bin/env python3
import argparse
import requests


def healthcheck():
	res = requests.get('http://localhost:7117/admin/healthcheck')
	print(res.status_code)
	print(res.json())
	return True




healthcheck()