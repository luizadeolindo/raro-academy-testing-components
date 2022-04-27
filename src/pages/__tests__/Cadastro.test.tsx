import { Cadastro } from "../Cadastro";
import { render, screen } from "@testing-library/react";
import faker from "@faker-js/faker";
import { validaErroApresentadoEmTela } from "../../helpers/teste/validaErroApresentadoEmTela";
import { validaErroNaoApresentadoEmTela } from "../../helpers/teste/validaErroNaoApresentadoEmTela";
import { setValorInput } from "../../helpers/teste/setValorInput";
import axios from "axios";

const makeSut = () => {
  return render(<Cadastro />);
};

describe("Cadastro Page", () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(makeSut);

  it("deve bloquear o submit caso os campos não estejam válidos", () => {
    const button = screen.getByText("Cadastrar");

    expect(button).toBeDisabled();
  });

  it("deve validar o formato de e-mail no cadastro", () => {
    const input = screen.getByPlaceholderText("e-mail");
    const value = faker.internet.email();
    const validation = "O formato do e-mail não é válido";

    validaErroApresentadoEmTela(input, validation);
    validaErroNaoApresentadoEmTela(input, value, validation);
  });

  describe("deve validar os critérios de aceitação da senha", () => {
    let input: HTMLElement;
    beforeEach(() => {
      input = screen.getByPlaceholderText("Senha");
    });

    it("senha deve ter 8 dígitos ou mais", () => {
      const value = faker.lorem.paragraph();
      const validation = "A senha deve ter pelo menos 8 caracteres";

      validaErroApresentadoEmTela(input, validation);
      validaErroNaoApresentadoEmTela(input, value, validation);
    });

    it("senha deve ter letra maiuscula", () => {
      const value = "Teste";
      const validation = "A senha deve ter pelo menos uma letra maiúscula";

      validaErroApresentadoEmTela(input, validation);
      validaErroNaoApresentadoEmTela(input, value, validation);
    });

    it("senha deve ter letra minúscula", () => {
      const value = "Teste";
      const validation = "A senha deve conter pelo menos uma letra minúscula";

      validaErroApresentadoEmTela(input, validation);
      validaErroNaoApresentadoEmTela(input, value, validation);
    });

    it("senha deve ter números", () => {
      const value = "Teste";
      const validation = "A senha deve conter pelo menos um número";

      validaErroApresentadoEmTela(input, validation);
      validaErroNaoApresentadoEmTela(input, value, validation);
    });

    it("senha deve ter caracteres especiais", () => {
      const value = "Teste";
      const validation = "Senha deve conter pelo menos um caractere especial";

      validaErroApresentadoEmTela(input, validation);
      validaErroNaoApresentadoEmTela(input, value, validation);
    });
  });

  it("deve garantir que senha e confirmação sejam iguais", () => {
    const password = screen.getByPlaceholderText("Senha");
    const value = "Teste";
    setValorInput(password, value);

    const confirmacao = screen.getByPlaceholderText("Confirmação de Senha");
    const validacao = "As senhas não são as mesmas!";

    validaErroApresentadoEmTela(confirmacao, validacao);
    validaErroNaoApresentadoEmTela(confirmacao, value, validacao);
  });

  it("deve enviar o formulário se todos os dados estiverem preenchidos corretamente", () => {
    const name = screen.getByPlaceholderText("Name");
    const email = screen.getByPlaceholderText("E-mail");
    const password = screen.getByPlaceholderText("Password");
    const passwordConfirmation = screen.getByPlaceholderText(
      "Password Confirmation"
    );
    const accessCode = screen.getByPlaceholderText("Access Code");
    const button = screen.getByText("Sign-up");
    const data = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "Senha!1",
      accessCode: faker.lorem.paragraph(),
    };

    setValorInput(name, data.name);
    setValorInput(email, data.email);
    setValorInput(password, data.password);
    setValorInput(passwordConfirmation, data.password);
    setValorInput(accessCode, data.accessCode);

    expect(button).toBeEnabled();
  });

  it("deve notificar o usuário que o cadastro foi efetuado com sucesso", () => {
    jest.spyOn(axios, "post").mockResolvedValue("ok");
    const name = screen.getByPlaceholderText("Name");
    const email = screen.getByPlaceholderText("E-mail");
    const password = screen.getByPlaceholderText("Password");
    const passwordConfirmation = screen.getByPlaceholderText(
      "Password Confirmation"
    );
    const accessCode = screen.getByPlaceholderText("Access Code");
    const button = screen.getByText("Sign-up");
    const data = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "Senha!1",
      accessCode: faker.lorem.paragraph(),
    };

    setValorInput(name, data.name);
    setValorInput(email, data.email);
    setValorInput(password, data.password);
    setValorInput(passwordConfirmation, data.password);
    setValorInput(accessCode, data.accessCode);
    button.click();

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/auth/cadastrar"),
      data
    );
  });

  it("deve apresentar os erros de validação para o usuário, caso a API retorne erro", async () => {
    jest.spyOn(axios, "post").mockRejectedValue(new Error("Validation error"));
    const name = screen.getByPlaceholderText("Name");
    const email = screen.getByPlaceholderText("E-mail");
    const password = screen.getByPlaceholderText("Password");
    const passwordConfirmation = screen.getByPlaceholderText(
      "Password Confirmation"
    );
    const accessCode = screen.getByPlaceholderText("Access Code");
    const button = screen.getByText("Sign-up");
    const data = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "Senha!1",
      accessCode: faker.lorem.paragraph(),
    };

    setValorInput(name, data.name);
    setValorInput(email, data.email);
    setValorInput(password, data.password);
    setValorInput(passwordConfirmation, data.password);
    setValorInput(accessCode, data.accessCode);
    button.click();

    expect(axios.post).toHaveBeenCalledWith(
      new Error("Validation error"),
      data
    );
  });
});
