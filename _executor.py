"""Roda o código do aluno com a entrada do teste. Usado pelo server.py."""
import builtins
import json
import sys
import traceback

with open(sys.argv[1], encoding="utf-8") as f:
    dados = json.load(f)

# Mostra o que foi "digitado", para a saída parecer um terminal de verdade.
# A pergunta e o valor digitado vão entre as marcas \x01 e \x02: o servidor tira as marcas para mostrar
# a saída e usa só o resto (o que o programa imprimiu) para corrigir.
INICIO, FIM = "\x01", "\x02"


def input_com_eco(prompt=""):
    sys.stdout.write(INICIO + str(prompt))
    linha = sys.stdin.readline()
    if not linha:
        sys.stdout.write(FIM)
        raise EOFError
    valor = linha.rstrip("\n")
    sys.stdout.write(valor + "\n" + FIM)
    return valor


builtins.input = input_com_eco


def falhar(mensagem):
    sys.stdout.flush()
    print(mensagem, file=sys.stderr)
    sys.exit(1)


ambiente = {"__name__": "__main__"}

try:
    exec(dados["antes"], ambiente)
    exec(compile(dados["codigo"], "seu_codigo.py", "exec"), ambiente)
except SyntaxError as e:
    falhar(f"Linha {e.lineno}: erro de sintaxe ({e.msg})")
except EOFError:
    falhar("Seu código pediu mais input() do que o teste digitou. Faltou um break?")
except Exception as e:
    linhas = [q.lineno for q in traceback.extract_tb(e.__traceback__) if q.filename == "seu_codigo.py"]
    onde = f"Linha {linhas[-1]}: " if linhas else ""
    falhar(f"{onde}{type(e).__name__}: {e}")

try:
    exec(dados["teste"], ambiente)
except AssertionError as e:
    falhar(f"Teste: {e}" if str(e) else "Teste: o resultado não é o esperado")
except NameError as e:
    falhar(f"Teste: não encontrei '{e.name}' no seu código")
except Exception as e:
    falhar(f"Teste: {type(e).__name__}: {e}")
