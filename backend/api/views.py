from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Hanzi
from .serializers import HanziSerializer

@api_view(['GET'])
def search_hanzi(request):
    query = request.GET.get('query', '')
    results = Hanzi.objects.filter(pinyin__icontains=query) | Hanzi.objects.filter(zhuyin__icontains=query)
    serializer = HanziSerializer(results, many=True)
    return Response(serializer.data)