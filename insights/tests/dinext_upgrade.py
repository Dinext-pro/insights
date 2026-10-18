"""Synthetic upgrade fixtures, available only through Frappe's test-server gate."""
import frappe
from frappe import _
from frappe.tests.ui_test_helpers import whitelist_for_tests
from frappe.utils.password import update_password

USER = "upgrade-insights@example.com"
TITLE = "Dinext upgrade smoke"


def _require_test_site():
	if not frappe.conf.allow_tests or not (frappe.flags.in_test or getattr(frappe.local, "dev_server", False)):
		frappe.throw(_("Upgrade fixtures require an enabled development test site"), frappe.PermissionError)
	frappe.only_for("System Manager")


@whitelist_for_tests
def csrf():
	_require_test_site()
	return frappe.sessions.get_csrf_token()


@whitelist_for_tests
def cleanup():
	_require_test_site()
	for name in frappe.get_all("Insights Workbook", filters={"title": TITLE, "owner": USER}, pluck="name"):
		frappe.delete_doc("Insights Workbook", name, force=True, ignore_permissions=True)
	if frappe.db.exists("User", USER):
		frappe.delete_doc("User", USER, force=True, ignore_permissions=True)


@whitelist_for_tests
def prepare():
	_require_test_site()
	cleanup()
	password = frappe.generate_hash(length=24)
	user = frappe.get_doc({
		"doctype": "User", "email": USER, "first_name": "Administrator Upgrade Test",
		"send_welcome_email": 0, "user_type": "System User", "language": "en",
	})
	user.insert(ignore_permissions=True)
	roles = [r for r in ['System Manager', 'Insights Admin', 'Insights User'] if frappe.db.exists("Role", r)]
	user.add_roles(*roles)
	update_password(USER, password)
	result = {"user": USER, "password": password, "title": TITLE}
	workbook = frappe.get_doc({"doctype": "Insights Workbook", "title": TITLE, "owner": USER})
	workbook.insert(ignore_permissions=True)
	result["workbook"] = workbook.name
	return result
