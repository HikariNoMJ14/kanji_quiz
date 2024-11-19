from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Hanzi
from .serializers import HanziSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'query',
            openapi.IN_QUERY,
            description="Search query",
            type=openapi.TYPE_STRING
        ),
        openapi.Parameter(
            'exact',
            openapi.IN_QUERY,
            description="Exact match flag (true or false)",
            type=openapi.TYPE_BOOLEAN
        )
    ],
    responses={200: HanziSerializer(many=True)}
)
@api_view(['GET'])
def search_hanzi(request):
    query = request.GET.get('query', '')
    exact = request.GET.get('exact', 'false').lower() == 'true'

    if exact:
        results = Hanzi.objects.filter(zhuyin=query) | Hanzi.objects.filter(
            pinyins__pinyin1=query) | Hanzi.objects.filter(pinyins__pinyin2=query)
    else:
        results = Hanzi.objects.filter(zhuyin__icontains=query) | Hanzi.objects.filter(
            pinyins__pinyin1__icontains=query) | Hanzi.objects.filter(pinyins__pinyin2__icontains=query)

    serializer = HanziSerializer(results, many=True)
    return Response(serializer.data)

@swagger_auto_schema(
    method='get',
    responses={200: HanziSerializer()}
)
@api_view(['GET'])
def hanzi_detail(request, id):
    try:
        hanzi = Hanzi.objects.get(id=id)
    except Hanzi.DoesNotExist:
        return Response({'error': 'Hanzi not found'}, status=404)

    serializer = HanziSerializer(hanzi)
    return Response(serializer.data)