# Jokenpô: versão de referência (a resposta do projeto final).
# Rode com: python jokenpo.py
import random

opcoes = ["pedra", "papel", "tesoura"]
vence = {"pedra": "tesoura", "tesoura": "papel", "papel": "pedra"}


def resultado(jogador, computador):
    if jogador == computador:
        return "empate"
    if vence[jogador] == computador:
        return "vitoria"
    return "derrota"


pontos_jogador = 0
pontos_computador = 0

while True:
    jogada = input("Sua jogada (pedra, papel, tesoura ou sair): ").strip().lower()
    if jogada == "sair":
        break
    if jogada not in opcoes:
        print("Jogada inválida!")
        continue

    computador = random.choice(opcoes)
    print(f"Computador jogou {computador}")

    r = resultado(jogada, computador)
    if r == "vitoria":
        pontos_jogador += 1
        print("Você venceu!")
    elif r == "derrota":
        pontos_computador += 1
        print("Computador venceu!")
    else:
        print("Empate!")

print(f"Placar: Você {pontos_jogador} x {pontos_computador} Computador")
