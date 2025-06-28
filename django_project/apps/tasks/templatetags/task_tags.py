from django import template

register = template.Library()

@register.filter
def get_item(dictionary, key):
    """Get item from dictionary by key"""
    return dictionary.get(key, [])

@register.filter
def status_color(status):
    """Trả về tên màu Bootstrap cho status task"""
    mapping = {
        'new': 'secondary',
        'in_progress': 'primary',
        'review': 'warning',
        'completed': 'success',
        'cancelled': 'danger',
    }
    return mapping.get(status, 'secondary') 